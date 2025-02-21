export type ResponseApiError = {
  error: Error;
  status: number;
  isError: true;
};

export type ResponseApiSuccess<T> = {
  data: T;
  status: number;
  isError: false;
};
