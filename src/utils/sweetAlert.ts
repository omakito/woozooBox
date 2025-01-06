import Swal, { type SweetAlertOptions } from 'sweetalert2'

export function openToast(options: SweetAlertOptions) {
  Swal.fire({
    background: '#222222',
    color: '#fafafa',
    toast: true,
    position: 'top-end',
    title: options.title ?? '',
    text: options.text ?? '',
    icon: options.icon,
    showConfirmButton: false,
    timer: options.timer ?? 3000,
    timerProgressBar: options.timerProgressBar ?? true,
  })
}

export function openLoadingToast(options: SweetAlertOptions) {
  Swal.fire({
    background: '#222222',
    color: '#fafafa',
    toast: true,
    position: 'top-end',
    title: options.title ?? '',
    text: options.text ?? '',
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading()
    },
  })
}

export function closeLoadingToast(options: SweetAlertOptions) {
  Swal.hideLoading()
  Swal.update({ icon: options.icon, title: options.title })
  setTimeout(() => {
    Swal.close()
  }, options.timer ?? 3000)
}

export function openDialogChoice(options: SweetAlertOptions) {
  const customSwal = Swal.mixin({
    background: '#181818',
    color: '#fafafa',
    cancelButtonColor: 'transparent',
    customClass: {
      cancelButton: 'swal-cancel-button',
      confirmButton: 'swal-confirm-button',
    },
  })

  return customSwal.fire({
    title: options.title ?? '',
    text: options.text ?? '',
    icon: options.icon ?? 'question',
    showCancelButton: true,
    confirmButtonText: options.confirmButtonText ?? 'Oui',
    cancelButtonText: options.cancelButtonText ?? 'Non',
  })
}

export function closeToast() {
  Swal.close()
}


