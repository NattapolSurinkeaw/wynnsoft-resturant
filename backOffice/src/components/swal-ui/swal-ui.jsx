import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const modalSwal = withReactContent(Swal);

const SwalUI = ({status, title, description}) => {
    if(status) {
      modalSwal.fire({
        position: "center",
        width: 450,
        icon: "success",
        title: title,
        text: description,
        showConfirmButton: false,
        timer: 1500,
      })
    } else {
      modalSwal.fire({
        position: "center",
        width: 450,
        icon: "error",
        title: title,
        text: description,
        showConfirmButton: false,
        timer: 1500,
      })
    }
}

export default SwalUI