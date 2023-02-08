import axios from "axios";
import firebase from "../config/firebase";

const createToken = async () => {
  const user = firebase.auth().currentUser;
  const token = user && (await user.getIdToken());

  const payloadHeader = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  return payloadHeader;
};

export async function getTasks(userId) {
  const header = await createToken();
  const { data } = await axios.get(
    `${process.env.REACT_APP_API_BASE_URI}/api/task/${userId}`,
    header
  );
  return data;
}

export async function createTask(object) {
  const header = await createToken();
  const { data } = await axios.post(
    `${process.env.REACT_APP_API_BASE_URI}/api/task`,
    object,
    header
  );
  return data;
}

export async function updateTask(update) {
  const header = await createToken();
  const { data } = await axios.put(
    `${process.env.REACT_APP_API_BASE_URI}/api/task/${update.id}`,
    update,
    header
  );
  return data;
}

export async function removeTask(object) {
  const header = await createToken();
  const { data } = await axios.delete(
    `${process.env.REACT_APP_API_BASE_URI}/api/task`,
    { header, data: object }
  );
  return data;
}
