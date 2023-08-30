import { myAxios } from "./helper";

export const signUp = (user,role) => {
  const requestData={
    ...user,
    role:role
  }
  return myAxios.post("/auth/register?role="+role,requestData).then((response) => response.data);
};

export const loginUser = (loginDetail) => {
  return myAxios
    .post("/auth/login", loginDetail)
    .then((response) => response.data);
};

export const getUser = (userId) => {
  return myAxios.get(`/users/${userId}`).then((resp) => resp.data);
};
