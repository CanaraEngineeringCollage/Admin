
import { apiFetch } from '../client';
import { FacultyFormData } from '../schemas';

export async function createFaculty(data: FacultyFormData) {
  return apiFetch('/faculty', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getAllFaculty() {
  return apiFetch('/faculty', {
    method: 'GET',
  });
}

export async function getFacultyById(id: string) {
  return apiFetch(`/faculty/${id}`, {
    method: 'GET',
  });
}

export async function updateFaculty(id: string, data: Partial<FacultyFormData>) {
  return apiFetch(`/faculty/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteFaculty(id: string) {
  return apiFetch(`/faculty/${id}`, {
    method: 'DELETE',
  });
}
