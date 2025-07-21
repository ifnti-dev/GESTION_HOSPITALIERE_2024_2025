import { useEffect, useState, useCallback } from "react";
import {
  getPermissions,
  getPermissionById,
  getPermissionByName,
  addPermission,
  updatePermission,
  deletePermission,
} from "@/services/utilisateur/permission.service";
import { Permission } from "@/types/utilisateur";

// Hook pour récupérer toutes les permissions
export function usePermissions() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // useEffect(() => {
  //   setLoading(true);
  //   setError(null);
  //   getPermissions()
  //     .then(setPermissions)
  //     .catch(setError)
  //     .finally(() => setLoading(false));
  // }, []);

  // return { permissions, loading, error };

  const fetchPermissions = useCallback(() => {
    setLoading(true);
    setError(null);
    return getPermissions()
      .then(setPermissions)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  return { permissions, loading, error, refetch: fetchPermissions };
}

// Hook pour récupérer une permission par ID
export function usePermissionById(permissionId: number | null) {
  const [permission, setPermission] = useState<Permission | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (permissionId === null) return;
    setPermission(null);
    setLoading(true);
    setError(null);

    getPermissionById(permissionId)
      .then(setPermission)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [permissionId]);

  return { permission, loading, error };
}

// Hook pour récupérer une permission par nom
export function usePermissionByName(nom: string | null) {
  const [permission, setPermission] = useState<Permission | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!nom) return;
    setPermission(null);
    setLoading(true);
    setError(null);

    getPermissionByName(nom)
      .then(setPermission)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [nom]);

  return { permission, loading, error };
}

// Hook pour ajouter une permission
export function useAddPermission() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const add = useCallback(async (permission: Permission) => {
    setLoading(true);
    setError(null);
    try {
      const result = await addPermission(permission);
      return result;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { add, loading, error };
}

// Hook pour mettre à jour une permission
export function useUpdatePermission() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const update = useCallback(async (permission: Permission) => {
    setLoading(true);
    setError(null);
    try {
      const result = await updatePermission(permission);
      return result;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { update, loading, error };
}

// Hook pour supprimer une permission
export function useDeletePermission() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const remove = useCallback(async (permissionId: number) => {
    setLoading(true);
    setError(null);
    try {
      await deletePermission(permissionId);
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { remove, loading, error };
}