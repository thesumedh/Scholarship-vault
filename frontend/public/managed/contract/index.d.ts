import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type Witnesses<PS> = {
}

export type ImpureCircuits<PS> = {
  verify_eligibility(context: __compactRuntime.CircuitContext<PS>,
                     gpa_0: bigint,
                     income_0: bigint): __compactRuntime.CircuitResults<PS, []>;
}

export type ProvableCircuits<PS> = {
  verify_eligibility(context: __compactRuntime.CircuitContext<PS>,
                     gpa_0: bigint,
                     income_0: bigint): __compactRuntime.CircuitResults<PS, []>;
}

export type PureCircuits = {
}

export type Circuits<PS> = {
  verify_eligibility(context: __compactRuntime.CircuitContext<PS>,
                     gpa_0: bigint,
                     income_0: bigint): __compactRuntime.CircuitResults<PS, []>;
}

export type Ledger = {
  readonly min_gpa: bigint;
  readonly max_income: bigint;
}

export type ContractReferenceLocations = any;

export declare const contractReferenceLocations : ContractReferenceLocations;

export declare class Contract<PS = any, W extends Witnesses<PS> = Witnesses<PS>> {
  witnesses: W;
  circuits: Circuits<PS>;
  impureCircuits: ImpureCircuits<PS>;
  provableCircuits: ProvableCircuits<PS>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<PS>,
               initial_min_gpa_0: bigint,
               initial_max_income_0: bigint): __compactRuntime.ConstructorResult<PS>;
}

export declare function ledger(state: __compactRuntime.StateValue | __compactRuntime.ChargedState): Ledger;
export declare const pureCircuits: PureCircuits;
