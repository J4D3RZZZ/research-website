import axios from "axios";

export async function testBackend() {
  try {
    const res = await axios.get("http://localhost:5000/api/test"); // make sure port matches your backend
    console.log("Backend says:", res.data);
  } catch (err) {
    console.error("Cannot reach backend:", err.message);
  }
}
