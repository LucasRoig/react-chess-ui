import React, { Component } from 'react'
import {render, unmountComponentAtNode} from "react-dom"

export class ModalWindow extends Component {
  close = () => {
    removeElement();
  }
}

const elementId = "modal-window";

function removeElement() {
  const target = document.getElementById(elementId);
  if (target) {
    unmountComponentAtNode(target);
    target.parentNode.removeChild(target);
  }
}


function createElement(element) {
  let targetDiv = document.getElementById(elementId);
  if (!targetDiv) {
    targetDiv = document.createElement("div");
    targetDiv.id = elementId;
    document.body.appendChild(targetDiv)
  }
  render(element, targetDiv);
}

export function showModal(element) {
  createElement(element);
}
