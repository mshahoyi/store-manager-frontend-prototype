import { ApiPaginatedData } from "../types/sharedTypes";
import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

export default class BaseApi<Model> {
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

  dataTable(): Promise<ApiPaginatedData<Model>> {
    return axios
      .get(this.url)
      .then((response) => response.data)
      .catch((error) => {
        throw error.data;
      });
  }

  get(id: number): Promise<Model> {
    return axios
      .get(this.url + id)
      .then((response) => response.data)
      .catch((err) => {
        throw err.data;
      });
  }

  post<U>(data: U): Promise<Model> {
    const formData = this.convertToFormData(data as Record<string, unknown>);
    return axios
      .post(this.url, formData)
      .then((response) => response.data)
      .catch((err) => {
        throw err.data;
      });
  }

  patch(id: number, data: Model): Promise<Model> {
    const formData = this.convertToFormData(data as Record<string, unknown>);
    return axios
      .patch(this.url + id, formData)
      .then((response) => response.data)
      .catch((err) => {
        throw err.data;
      });
  }

  delete(id: number): Promise<Model> {
    return axios
      .delete(this.url + id)
      .then((response) => response.data)
      .catch((err) => {
        throw err.data;
      });
  }
}
