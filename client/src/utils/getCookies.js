export default function getCookies() {
  const cookieObject = document.cookie.split("; ").reduce((prev, current) => {
    const [name, ...value] = current.split("=");
    prev[name] = value.join("=");
    return prev;
  }, {});

  const admin = typeof cookieObject.admin !== "undefined";
  const state = {
    logged: cookieObject.email ? true : false,
    admin: admin ? true : false,
    email: cookieObject.email,
    first_name: cookieObject.first_name,
    last_name: cookieObject.last_name,
  };

  return state;
}
