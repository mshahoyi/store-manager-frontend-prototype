import { ApiPaginatedData } from "../types/sharedTypes";
import axios from "axios";

axios.defaults.baseURL =
  process.env.REACT_APP_BASE_URL || "https://store-prototype.herokuapp.com";

export default class BaseApi<Model extends unknown> {
  resource: String;

  get url() {
    return "/api/v1/" + this.resource + "/";
  }

  constructor(resource: string) {
    this.resource = resource;
  }

  convertToFormData(object: Record<string, unknown>): FormData {
    const formData = new FormData();
    Object.keys(object).forEach((key) =>
      formData.append(key, object[key] as string)
    );
    return formData;
  }

  dataTable(storeId?: number): Promise<ApiPaginatedData<Model>> {
    return axios
      .get(this.url + (storeId || ""))
      .then((response) => response.data);
  }

  get(id: number): Promise<Model> {
    return axios.get(this.url + id).then((response) => response.data);
  }

  post(data: Model, storeId?: number): Promise<Model> {
    if (storeId) {
      (data as { storeId: number }).storeId = storeId;
    }
    const formData = this.convertToFormData(data as Record<string, unknown>);
    return axios.post(this.url, formData).then((response) => response.data);
  }

  patch(id: number, data: Model, storeId?: number): Promise<Model> {
    if (storeId) {
      (data as { storeId: number }).storeId = storeId;
    }
    const formData = this.convertToFormData(data as Record<string, unknown>);
    return axios
      .patch(this.url + id, formData)
      .then((response) => response.data);
  }

  delete(id: number): Promise<Model> {
    return axios.delete(this.url + id).then((response) => response.data);
  }
}
