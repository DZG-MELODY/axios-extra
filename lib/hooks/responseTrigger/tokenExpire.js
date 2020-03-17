export default function tokenExpire(response) {
  const code = response.data && response.data.code;
  return code === 50001001 || code === 50001006 || code === 50001005;
}
