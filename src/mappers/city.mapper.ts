export default function mapper(data: City): City {
  return {
    code: data.code,
    fullname: data.fullname,
  };
}
