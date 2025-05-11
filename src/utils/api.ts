/**
 * - O2, He 는 0~100 범위의 숫자 (예: 32 → 32%)
 * - N2 는 직접 입력받지 않고, 100 - (O2 + He) 로 계산
 */
interface GasMixInputPercent {
  P_residual: number; // 잔압 (bar)
  O2_pct_residual: number; // 잔존 산소 비율 (%) e.g. 32
  He_pct_residual: number; // 잔존 헬륨 비율 (%) e.g. 0
  N2_pct_residual: number; // 잔존 질소 비율 (%) e.g. 68

  P_total: number; // 목표 최종 압력 (bar)
  O2_pct_target: number; // 목표 산소 비율 (%) e.g. 36
  He_pct_target: number; // 목표 헬륨 비율 (%) e.g. 0
  N2_pct_target: number; // 목표 질소 비율 (%) e.g. 64
}

interface GasMixResult {
  O2_fill: number; // 필요한 O₂ 주입 압력 (bar)
  He_fill: number; // 필요한 He 주입 압력 (bar)
  Air_fill: number; // 필요한 공기 주입 압력 (bar)
  FO2_final: number; // 최종 혼합기체 산소 분율 (%)
  FHe_final: number; // 최종 혼합기체 헬륨 분율 (%)
  FN2_final: number; // 최종 혼합기체 질소 분율 (%)
  MOD_1_4: number; // MOD (O₂ pp 1.4 bar 기준, m)
  MOD_1_6: number; // MOD (O₂ pp 1.6 bar 기준, m)
}

export function planGasMixPercent(input: GasMixInputPercent): GasMixResult {
  const {
    P_residual,
    O2_pct_residual,
    He_pct_residual,
    N2_pct_residual,
    O2_pct_target,
    He_pct_target,
    N2_pct_target,
    P_total,
  } = input;

  // % → fraction 변환
  const FO2_res = O2_pct_residual / 100;
  const FHe_res = He_pct_residual / 100;
  const FO2_tar = O2_pct_target / 100;
  const FHe_tar = He_pct_target / 100;

  // 질소 비율 (fraction)
  const FN2_res = N2_pct_residual / 100;
  const FN2_tar = N2_pct_target / 100;

  // 잔존 가스 부분압
  const PO2_res = P_residual * FO2_res;
  const PHe_res = P_residual * FHe_res;
  const PN2_res = P_residual * FN2_res;

  // 목표 부분압
  const PO2_tar = P_total * FO2_tar;
  const PHe_tar = P_total * FHe_tar;
  const PN2_tar = P_total * FN2_tar;

  // 필요한 가스 충전량 계산
  const He_fill = PHe_tar - PHe_res; // 순수 He
  const Air_fill = (PN2_tar - PN2_res) / 0.79; // 공기 (79% N₂)
  const O2_fill = PO2_tar - PO2_res - 0.21 * Air_fill; // 순수 O₂

  // 최종 혼합 비율 (fraction → %)
  const FO2_final = ((PO2_res + O2_fill + 0.21 * Air_fill) / P_total) * 100;
  const FHe_final = ((PHe_res + He_fill) / P_total) * 100;
  const FN2_final = 100 - FO2_final - FHe_final;

  // MOD 계산 (m)
  const MOD_1_4 = (1.4 / (FO2_final / 100) - 1) * 10;
  const MOD_1_6 = (1.6 / (FO2_final / 100) - 1) * 10;

  return {
    O2_fill,
    He_fill,
    Air_fill,
    FO2_final,
    FHe_final,
    FN2_final,

    MOD_1_4,
    MOD_1_6,
  };
}
