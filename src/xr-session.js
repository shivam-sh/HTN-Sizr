import React from "react";
import * as THREE from "three";
import { ARButton } from "three/examples/jsm/webxr/ARButton.js";
import { BufferGeometryUtils } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { useHistory, Redirect } from "react-router";
import createHistory from "history/createBrowserHistory";
//import Data from "./Data";

let container, labelContainer;
let camera, scene, renderer, light;
let controller;
let init = 0;
let session;

let hitTestSource = null;
let hitTestSourceRequested = false;

let measurements = [];
let labels = [];
let domOverlays = [];

let reticle;
let currentLine = null;

let width, height;

let length_and_width = {
  length: 0,
  width: 0,
};

let redo = null;

const measureAgain = (redo) => {
  if (redo) {
    length_and_width["length"] = 0;
    length_and_width["width"] = 0;

    redo = null;
  } else {
    if (length_and_width["width"] !== 0) {
      let bg = document.createElement("div");
      bg.className = "hover-bg";

      let hover = document.createElement("div");
      hover.className = "hover";
      hover.innerHTML = `
        <h1>Foot Scanned!</h1>
        <p>Length: ${Math.round(length_and_width["length"] * 100) / 100}</p>
        <p>Width: ${Math.round(length_and_width["width"] * 100) / 100}</p>
        <div class="confirmation"></div>
        `;
      let cancel = document.createElement("h3");
      cancel.className = "cancel";
      cancel.innerText = "Cancel";

      let confirm = document.createElement("h3");
      confirm.className = "confirm";
      confirm.innerText = "Confirm";

      bg.appendChild(hover);
      document.body.appendChild(bg);
      let confirmation = document.getElementsByClassName("confirmation")[0];
      confirmation.appendChild(cancel);
      confirmation.appendChild(confirm);

      cancel.onclick = () => {
        document.getElementsByClassName("hover-bg")[0].remove();
        while (scene.children.length > 0) {
          scene.remove(scene.children[0]);
        }
        scene.add(reticle);
        onUndo();
      };

      confirm.onclick = async () => {

        let measurements = {
          'length': (Math.round(length_and_width["length"] * 100) / 100),
          'width': (Math.round(length_and_width["width"] * 100) / 100)
        }

        localStorage.setItem("userData", JSON.stringify(measurements))

        if (session) {
          await session.end();
        }

        document.getElementsByClassName("ar-overlay")[0].remove();
        document.getElementsByClassName("ar-overlay")[0].remove();
        document.getElementsByClassName("hover-bg")[0].remove();
        document.getElementById("root").style = null;
        document.body.style = null;
        //let data = new Data(length_and_width);

        window.location.href = "/form";
      };
    }
  }
};

/*function resetMe*/

function toScreenPosition(point, camera) {
  var vector = new THREE.Vector3();

  vector.copy(point);
  vector.project(camera);

  vector.x = ((vector.x + 1) * width) / 2;
  vector.y = ((-vector.y + 1) * height) / 2;
  vector.z = 0;

  return vector;
}

function getCenterPoint(points) {
  let line = new THREE.Line3(...points);
  return line.getCenter();
}

function matrixToVector(matrix) {
  let vector = new THREE.Vector3();
  vector.setFromMatrixPosition(matrix);
  return vector;
}

function initLine(point) {
  let lineMaterial = new THREE.LineBasicMaterial({
    color: 0xffffff,
    linewidth: 2,
    linecap: "round",
  });

  let lineGeometry = new THREE.BufferGeometry().setFromPoints([point, point]);
  return new THREE.Line(lineGeometry, lineMaterial);
}

function updateLine(matrix) {
  let positions = currentLine.geometry.attributes.position.array;
  positions[3] = matrix.elements[12];
  positions[4] = matrix.elements[13];
  positions[5] = matrix.elements[14];
  currentLine.geometry.attributes.position.needsUpdate = true;
  currentLine.geometry.computeBoundingSphere();
}

function initReticle() {
  let ring = new THREE.RingBufferGeometry(0.004, 0.0046, 32).rotateX(
    -Math.PI / 2
  );
  let dot = new THREE.CircleBufferGeometry(0.0002, 32).rotateX(-Math.PI / 2);
  reticle = new THREE.Mesh(
    BufferGeometryUtils.mergeBufferGeometries([ring, dot]),
    new THREE.MeshBasicMaterial()
  );
  reticle.matrixAutoUpdate = false;
  reticle.visible = false;
}

function initRenderer() {
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true;
}

function initLabelContainer() {
  labelContainer = document.createElement("div");
  labelContainer.style.position = "absolute";
  labelContainer.style.top = "0px";
  labelContainer.style.pointerEvents = "none";
  labelContainer.setAttribute("id", "container");
}

function initCamera() {
  camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 20);
}

function initLight() {
  light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
  light.position.set(0.5, 1, 0.25);
}

function initScene() {
  scene = new THREE.Scene();
}

function getDistance(points) {
  if (points.length == 2) {
    let distance = points[0].distanceTo(points[1]);

    // check if the length is null
    if (length_and_width["length"] === 0) {
      length_and_width["length"] = distance * 100;
    } else if (length_and_width["width"] === 0) {
      // check if width is null and record value
      length_and_width["width"] = distance * 100;
    }
    return distance;
  }
}

function initXR() {
  container = document.createElement("div");
  document.body.appendChild(container);

  width = window.innerWidth;
  height = window.innerHeight;

  initScene();

  initCamera();

  initLight();
  scene.add(light);

  initRenderer();
  container.appendChild(renderer.domElement);

  initLabelContainer();
  container.appendChild(labelContainer);

  document.body.appendChild(
    ARButton.createButton(renderer, {
      optionalFeatures: ["dom-overlay"],
      domOverlay: { root: document.querySelector("#container") },
      requiredFeatures: ["hit-test"],
    })
  );

  controller = renderer.xr.getController(0);
  //controller.addEventListener('select', onSelect);
  scene.add(controller);

  initReticle();

  scene.add(reticle);

  window.addEventListener("resize", onWindowResize, false);
  if (redo !== false) {
    animate();
  }
}

function onSelect() {
  if (reticle.visible) {
    measurements.push(matrixToVector(reticle.matrix));

    if (measurements.length == 2) {
      let distance = getDistance(measurements) * 100;

      if (length_and_width["length"] !== 0) {
        // add code here to change the redo variable depending on what the person presses
        redo = false;
        // reset the length and with if the person would like to redo
        measureAgain(redo);
      }

      let text = document.createElement("div");
      text.className = "label";
      text.style.color = "rgb(255,255,255)";
      text.textContent = distance + " cm";
      //document.querySelector("#container").appendChild(text);

      labels.push({ div: text, point: getCenterPoint(measurements) });

      measurements = [];
      currentLine = null;
    } else if (!length_and_width["width"]) {
      currentLine = initLine(measurements[0]);
      scene.add(currentLine);
    }
  }
}

function onWindowResize() {
  width = window.innerWidth;
  height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

function animate() {
  renderer.setAnimationLoop(render);
}

function onUndo() {
  /*let removed = null;*/
  /*// check if this is the first point and reset the point
    if (measurements.length == 1 && length_and_width["length"] === 0) {
        measurements = [];
        currentLine = null;
        removed = "point 1";

        // check if the length has already been taken
    } else if (length_and_width["width"] === 0 && measurements.length == 0) {
        length_and_width["length"] = 0
        removed = "measurement 1";
        // width point 1 was just taken
    } else if (length_and_width["width"] === 0 && measurements.length == 1) {
        measurements = [];
        currentLine = null;
        removed = "point 2";
        // removes the 2nd measurement (width)
    } else {*/
  length_and_width["length"] = 0;
  length_and_width["width"] = 0;
  measurements = [];
  currentLine = null;
}

function render(timestamp, frame) {
  if (frame) {
    let referenceSpace = renderer.xr.getReferenceSpace();
    session = renderer.xr.getSession();
    if (hitTestSourceRequested === false) {
      session.requestReferenceSpace("viewer").then(function (referenceSpace) {
        session
          .requestHitTestSource({ space: referenceSpace })
          .then(function (source) {
            hitTestSource = source;
          });
      });
      session.addEventListener("end", function () {
        hitTestSourceRequested = false;
        hitTestSource = null;
      });
      hitTestSourceRequested = true;
    }

    if (hitTestSource) {
      let hitTestResults = frame.getHitTestResults(hitTestSource);
      if (hitTestResults.length) {
        let hit = hitTestResults[0];
        reticle.visible = true;
        reticle.matrix.fromArray(hit.getPose(referenceSpace).transform.matrix);
      } else {
        reticle.visible = false;
      }

      if (currentLine) {
        updateLine(reticle.matrix);
      }
    }

    labels.map((label) => {
      let pos = toScreenPosition(label.point, renderer.xr.getCamera(camera));
      label.div.style.transform =
        "translate(-50%, -50%) translate(" + pos.x + "px," + pos.y + "py)";
    });
  }
  renderer.render(scene, camera);

  if (frame && domOverlays != [] && init < 2) {
    init++;

    let overlays = document.createElement("div");
    overlays.className = "ar-overlay";

    let aroTop = document.createElement("div");
    aroTop.className = "aro-top";

    let aroBottom = document.createElement("div");
    aroBottom.className = "aro-bottom";

    overlays.appendChild(aroTop);
    overlays.appendChild(aroBottom);

    let back = document.createElement("i");
    back.className = "fas fa-chevron-left";
    back.onclick = () => {
      window.location.reload();
    };

    aroTop.appendChild(back);

    let cancel = document.createElement("i");
    cancel.className = "fas fa-undo-alt";
    cancel.onclick = () => {
      while (scene.children.length > 0) {
        scene.remove(scene.children[0]);
      }
      scene.add(reticle);
      onUndo();
    };

    let add = document.createElement("div");
    add.className = "fas fa-plus";
    add.onclick = () => {
      onSelect();
    };

    let help = document.createElement("div");
    help.className = "fas fa-question";
    help.onclick = () => {
      let bg = document.createElement("div");
      bg.className = "hover-bg";

      let hover = document.createElement("div");
      hover.className = "hover";
      hover.innerHTML = `
      <h1> SIZR. Instructions</h1>
      <p> - Move your phone around, until you see a marker on your screen</p>
      <p> - Move marker to an area beside the front of your foot, and tap '+' to start measuring the length</p>
      <p> - Move marker to an area beside back of you heel and tap '+' to finish measuring the length</p>
      <p> - Move marker to the right of the widest part of your foot and tap '+' to begin measuring the width</p>
      <p> - Move marker to the left of the widest part of your foot and tap '+' to finish measuring the width</p>
      `;

      bg.onclick = () => {
        document.getElementsByClassName("hover-bg")[0].remove();
        while (scene.children.length > 0) {
          scene.remove(scene.children[0]);
        }
        scene.add(reticle);
        onUndo();
      };

      bg.appendChild(hover);
      document.body.appendChild(bg);
    };

    aroBottom.appendChild(cancel);
    aroBottom.appendChild(add);
    aroBottom.appendChild(help);

    document.body.appendChild(overlays);
  }
}

export { initXR };
