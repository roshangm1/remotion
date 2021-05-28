import {useCallback, useMemo, useRef} from 'react';
import {CancellablePromise} from './cancellable-promise';

const useCancellablePromises = () => {
	const pendingPromises = useRef<CancellablePromise[]>([]);

	const appendPendingPromise = useCallback((promise: CancellablePromise) => {
		pendingPromises.current = [...pendingPromises.current, promise];
	}, []);

	const removePendingPromise = useCallback((promise: CancellablePromise) => {
		pendingPromises.current = pendingPromises.current.filter(
			(p) => p !== promise
		);
	}, []);

	const clearPendingPromises = useCallback(
		() => pendingPromises.current.map((p) => p.cancel()),
		[]
	);

	const api = useMemo(
		() => ({
			appendPendingPromise,
			removePendingPromise,
			clearPendingPromises,
		}),
		[clearPendingPromises]
	);

	return api;
};

export {useCancellablePromises};