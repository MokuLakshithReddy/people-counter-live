# HeadCount — Browser-Based People Counter

HeadCount is a browser dashboard prototype that uses a webcam and the TensorFlow.js COCO-SSD object-detection model to identify visible people in a camera frame. It draws person bounding boxes, shows a live count, tracks the session peak, and records count changes in a local on-screen log.

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=111)](https://react.dev/)
[![TensorFlow.js](https://img.shields.io/badge/ML-TensorFlow.js-FF6F00?logo=tensorflow&logoColor=white)](https://www.tensorflow.org/js)
[![COCO-SSD](https://img.shields.io/badge/Model-COCO--SSD-4285F4)](https://github.com/tensorflow/tfjs-models/tree/master/coco-ssd)
[![Stars](https://img.shields.io/github/stars/MokuLakshithReddy/people-counter-live?style=flat-square)](https://github.com/MokuLakshithReddy/people-counter-live/stargazers)
[![Last commit](https://img.shields.io/github/last-commit/MokuLakshithReddy/people-counter-live?style=flat-square)](https://github.com/MokuLakshithReddy/people-counter-live/commits/main)

## How it works

~~~mermaid
flowchart TD
    A["User opens HeadCount"] --> B["Browser requests camera permission"]
    B --> C["Camera stream"]
    C --> D["TensorFlow.js + COCO-SSD"]
    D --> E["Filter detections: class = person, score > 0.5"]
    E --> F["Draw bounding boxes and confidence labels"]
    E --> G["Update current and peak counts"]
    G --> H["Append count changes to session log"]
~~~

## Current features

- Browser camera capture through the MediaDevices API (640 × 480 requested).
- In-browser COCO-SSD model loading via TensorFlow.js.
- Person-only detections with a confidence threshold greater than 0.5.
- Canvas overlay with bounding boxes and confidence labels.
- Live count, session peak, and a rolling list of up to 100 count-change log entries.
- Light/dark theme toggle and responsive dashboard layout.

## Run locally

Requirements: Node.js and npm, plus a modern browser with camera access.

~~~bash
npm install
npm run dev
~~~

Open the Vite development URL and allow camera access when prompted. Camera permission is required for detection.

## Privacy and limitations

- The current implementation obtains a camera stream in the browser and runs the model in the client. Do not deploy it in spaces where people have not been informed and given appropriate notice.
- The repository code shown here does not persist video or create identity profiles; the log stores timestamps and counts in the current UI session.
- Counts are model detections, not a calibrated occupancy measurement. Occlusion, camera angle, lighting, crowd density, and device performance can affect results.
- No labelled evaluation dataset, precision/recall benchmark, or count-accuracy study is currently published.

## Why it matters

A lightweight visual counter can help prototype occupancy-awareness workflows without identifying individuals. Before operational use, it needs site-specific validation, clear signage/consent, and an accuracy evaluation under real camera conditions.
