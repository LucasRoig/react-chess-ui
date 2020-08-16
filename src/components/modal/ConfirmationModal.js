import React from "react"
import {ModalWindow, showModal} from "./Modal";
import PropTypes from "prop-types"

class ConfirmationModal extends ModalWindow {
  static propTypes = {
    title: PropTypes.string,
    message: PropTypes.string,
    onConfirm: PropTypes.func,
    onCancel: PropTypes.func,
    confirmButtonText: PropTypes.string,
    cancelButtonText: PropTypes.string,
    confirmButtonClass: PropTypes.string
  }

  static defaultProps = {
    title: "Confirmation",
    message: "Êtes-vous sûr ?",
    onConfirm: () => null,
    onCancel: () => null,
    confirmButtonText: "Valider",
    cancelButtonText : "Annuler",
    confirmButtonClass: "is-success"
  }

  handleCancel = () => {
    this.props.onCancel();
    this.close();
  }

  handleConfirm = () => {
    this.props.onConfirm();
    this.close();
  }

  render() {
    return (
      <div className="modal is-active">
        <div className="modal-background" onClick={this.handleCancel}/>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">{this.props.title}</p>
          </header>
          <section className="modal-card-body">
            <p>{this.props.message}</p>
          </section>
          <footer className="modal-card-foot space-between">
            <button className="button" onClick={this.handleCancel}>{this.props.cancelButtonText}</button>
            <button className={"button " + this.props.confirmButtonClass} onClick={this.handleConfirm}>
              {this.props.confirmButtonText}
            </button>
          </footer>
        </div>
      </div>
    )
  }
}

export function showConfirmationModal(props) {
  showModal(<ConfirmationModal {...props}/>)
}
