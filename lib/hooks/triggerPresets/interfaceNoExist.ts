import { AxiosResponse } from "axios";

export default function interfaceNoExist(response: AxiosResponse): boolean {
  return response.status === 404;
}
