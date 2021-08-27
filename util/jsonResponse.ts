export default function jsonResponse(body: unknown) {
  return {
    status: 200,
    headers: new Headers({
      "content-type": "application/json; charset=utf8",
    }),
    body: JSON.stringify(body),
  };
}
