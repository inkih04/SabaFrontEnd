//const DOMAIN_NAME = '127.0.0.1:8000';//Recuerda que este usa http:
const DOMAIN_NAME = 'it22d-backend.onrender.com';
const API_BASE = `https://${DOMAIN_NAME}/api/`;

// Mapea el modelo a la ruta de la API
const endpointMap = {
  status: "statuses",
  priorities: "priorities",
  types: "types",
  severities: "severities"
};

function getEndpoint(model) {
  return endpointMap[model] || model;
}

export async function listSettings(model, token) {
  const endpoint = getEndpoint(model);
  const res = await fetch(`${API_BASE}${endpoint}/`, {
    headers: { Authorization: token }
  });
  if (!res.ok) throw new Error("Error al listar");
  return await res.json();
}

export async function createSetting(model, data, token) {
  const endpoint = getEndpoint(model);
  return fetch(`${API_BASE}${endpoint}/`, {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
}

export async function updateSetting(model, id, data, token) {
  const endpoint = getEndpoint(model);
  return fetch(`${API_BASE}${endpoint}/${id}/`, {
    method: "PUT",
    headers: {
      Authorization: token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
}

export async function deleteSetting(model, id, token) {
  const endpoint = getEndpoint(model);
  return fetch(`${API_BASE}${endpoint}/${id}/`, {
    method: "DELETE",
    headers: { Authorization: token }
  });
}