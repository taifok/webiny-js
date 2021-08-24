import { RecoilState, useRecoilCallback, RecoilValueReadOnly, SetterOrUpdater } from "recoil";

export type ValueOrSetter<T> = SetterOrUpdater<T> | (T | ((prevValue: T) => T));

interface Portal {
    getState?: <T>(atom: RecoilState<T> | RecoilValueReadOnly<T>) => T;
    setState?: <T>(state: RecoilState<T>, valueOrSetter: ValueOrSetter<T>) => void;
}

const portal: Portal = {};

export default function RecoilExternal() {
    portal.getState = useRecoilCallback<[atom: RecoilState<any>], any>(
        ({ snapshot }) =>
            function <T>(atom: RecoilState<T>) {
                return snapshot.getLoadable(atom).contents;
            },
        []
    );

    portal.setState = useRecoilCallback(({ set }) => set, []);

    return null;
}

export const getState: Portal["getState"] = atom => {
    return portal.getState(atom);
};

export const setState: Portal["setState"] = (atom, valueOrSetter) => {
    portal.setState(atom, valueOrSetter);
};
