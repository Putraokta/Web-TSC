import { useCallback, useState } from "react";
import authService from "@/services/auth.service";
import { setAuthToken } from "@/lib/axioos";
import { getErrorMessage } from "@/lib/error";
import { ILogin } from "@/types/Auth";

type LoginResult = {
	loading: boolean;
	error: string | null;
	login: (payload: ILogin, onSuccess?: () => void) => Promise<void>;
};

export default function useLogin(): LoginResult {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const login = useCallback(async (payload: ILogin, onSuccess?: () => void) => {
		setLoading(true);
		setError(null);
		try {
			const res = await authService.login(payload);
			const accessToken = res?.data?.accessToken || res?.accessToken;
			if (accessToken) {
				setAuthToken(accessToken);
			}
			if (onSuccess) onSuccess();
		} catch (err: any) {
			const msg = getErrorMessage(err) || "Login failed";
			setError(msg);
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	return { loading, error, login };
}

