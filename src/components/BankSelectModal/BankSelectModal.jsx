import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { useThemeColors } from "../../hooks/useThemeColors";

export const BANK_LIST = [
  {
    name: "Vietcombank",
    code: "VCB",
    logo: "https://api.vietqr.io/img/VCB.png",
  },
  {
    name: "VietinBank",
    code: "CTG",
    logo: "https://api.vietqr.io/img/CTG.png",
  },
  {
    name: "Techcombank",
    code: "TCB",
    logo: "https://api.vietqr.io/img/TCB.png",
  },
  { name: "BIDV", code: "BIDV", logo: "https://api.vietqr.io/img/BIDV.png" },
  {
    name: "Agribank",
    code: "VARB",
    logo: "https://api.vietqr.io/img/VARB.png",
  },
  { name: "NCB", code: "NVB", logo: "https://api.vietqr.io/img/NVB.png" },
  { name: "Sacombank", code: "STB", logo: "https://api.vietqr.io/img/STB.png" },
  { name: "ACB", code: "ACB", logo: "https://api.vietqr.io/img/ACB.png" },
  { name: "MB Bank", code: "MB", logo: "https://api.vietqr.io/img/MB.png" },
  { name: "TPBank", code: "TPB", logo: "https://api.vietqr.io/img/TPB.png" },
  {
    name: "Shinhan Bank VN",
    code: "SVB",
    logo: "https://api.vietqr.io/img/SVB.png",
  },
  { name: "VIB", code: "VIB", logo: "https://api.vietqr.io/img/VIB.png" },
  { name: "VPBank", code: "VPB", logo: "https://api.vietqr.io/img/VPB.png" },
  { name: "SHB", code: "SHB", logo: "https://api.vietqr.io/img/SHB.png" },
  { name: "Eximbank", code: "EIB", logo: "https://api.vietqr.io/img/EIB.png" },
  {
    name: "BaoViet Bank",
    code: "BVB",
    logo: "https://api.vietqr.io/img/BVB.png",
  },
  {
    name: "Viet Capital Bank",
    code: "VCCB",
    logo: "https://api.vietqr.io/img/VCCB.png",
  },
  { name: "SCB", code: "SCB", logo: "https://api.vietqr.io/img/SCB.png" },
  { name: "VRB", code: "VRB", logo: "https://api.vietqr.io/img/VRB.png" },
  { name: "ABBank", code: "ABB", logo: "https://api.vietqr.io/img/ABB.png" },
  {
    name: "PVcomBank",
    code: "PVCB",
    logo: "https://api.vietqr.io/img/PVCB.png",
  },
  { name: "OceanBank", code: "OJB", logo: "https://api.vietqr.io/img/OJB.png" },
  {
    name: "Nam A Bank",
    code: "NAB",
    logo: "https://api.vietqr.io/img/NAB.png",
  },
  { name: "HDBank", code: "HDB", logo: "https://api.vietqr.io/img/HDB.png" },
  { name: "VietBank", code: "VB", logo: "https://api.vietqr.io/img/VB.png" },
  { name: "CFC", code: "CFC", logo: "https://api.vietqr.io/img/CFC.png" },
  {
    name: "Public Bank VN",
    code: "PBVN",
    logo: "https://api.vietqr.io/img/PBVN.png",
  },
  {
    name: "Hong Leong Bank VN",
    code: "HLB",
    logo: "https://api.vietqr.io/img/HLB.png",
  },
  { name: "PG Bank", code: "PGB", logo: "https://api.vietqr.io/img/PGB.png" },
  {
    name: "CO-OP Bank",
    code: "COB",
    logo: "https://api.vietqr.io/img/COB.png",
  },
  {
    name: "CIMB Bank VN",
    code: "CIMB",
    logo: "https://api.vietqr.io/img/CIMB.png",
  },
  {
    name: "Indovina Bank",
    code: "IVB",
    logo: "https://api.vietqr.io/img/IVB.png",
  },
  {
    name: "DongA Bank",
    code: "DAB",
    logo: "https://api.vietqr.io/img/DAB.png",
  },
  { name: "GPBank", code: "GPB", logo: "https://api.vietqr.io/img/GPB.png" },
  { name: "VietABank", code: "VAB", logo: "https://api.vietqr.io/img/VAB.png" },
  {
    name: "Saigon Bank",
    code: "SGB",
    logo: "https://api.vietqr.io/img/SGB.png",
  },
  { name: "MSB", code: "MSB", logo: "https://api.vietqr.io/img/MSB.png" },
  {
    name: "LienVietPostBank",
    code: "LPB",
    logo: "https://api.vietqr.io/img/LPB.png",
  },
  {
    name: "KienlongBank",
    code: "KLB",
    logo: "https://api.vietqr.io/img/KLB.png",
  },
  {
    name: "IBK Hanoi",
    code: "IBKHN",
    logo: "https://api.vietqr.io/img/IBKHN.png",
  },
  {
    name: "Woori Bank VN",
    code: "WOO",
    logo: "https://api.vietqr.io/img/WOO.png",
  },
  { name: "SeABank", code: "SEAB", logo: "https://api.vietqr.io/img/SEAB.png" },
  {
    name: "UOB Vietnam",
    code: "UOB",
    logo: "https://api.vietqr.io/img/UOB.png",
  },
  { name: "OCB", code: "OCB", logo: "https://api.vietqr.io/img/OCB.png" },
  {
    name: "Mirae Asset Finance",
    code: "MAFC",
    logo: "https://api.vietqr.io/img/MAFC.png",
  },
  {
    name: "KEB Hana HCM",
    code: "KEBHANAHCM",
    logo: "https://api.vietqr.io/img/KEBHANAHCM.png",
  },
  {
    name: "KEB Hana Hanoi",
    code: "KEBHANAHN",
    logo: "https://api.vietqr.io/img/KEBHANAHN.png",
  },
  {
    name: "Standard Chartered VN",
    code: "STANDARD",
    logo: "https://api.vietqr.io/img/STANDARD.png",
  },
  {
    name: "Cake by VPBank",
    code: "CAKE",
    logo: "https://api.vietqr.io/img/CAKE.png",
  },
  {
    name: "Ubank by VPBank",
    code: "Ubank",
    logo: "https://api.vietqr.io/img/Ubank.png",
  },
  {
    name: "Nonghyup Bank HN",
    code: "NonghyupBankHN",
    logo: "https://api.vietqr.io/img/NonghyupBankHN.png",
  },
  {
    name: "KB Kookmin Hanoi",
    code: "KBHN",
    logo: "https://api.vietqr.io/img/KBHN.png",
  },
  {
    name: "KB Kookmin HCM",
    code: "KBHCM",
    logo: "https://api.vietqr.io/img/KBHCM.png",
  },
  {
    name: "DBS Bank HCM",
    code: "DBSHCM",
    logo: "https://api.vietqr.io/img/DBSHCM.png",
  },
  {
    name: "CBBank",
    code: "CBBank",
    logo: "https://api.vietqr.io/img/CBBank.png",
  },
  {
    name: "Kasikorn Bank HCM",
    code: "KBankHCM",
    logo: "https://api.vietqr.io/img/KBankHCM.png",
  },
  {
    name: "HSBC Vietnam",
    code: "HSBC",
    logo: "https://api.vietqr.io/img/HSBC.png",
  },
];

/**
 * BankSelectModal — reusable bank picker
 *
 * Props:
 *   isOpen          boolean
 *   onOpenChange    (open: boolean) => void   (HeroUI modal API)
 *   selectedBankCode  string | ""
 *   onSelect        (bank: { name, code, logo }) => void
 */
export default function BankSelectModal({
  isOpen,
  onOpenChange,
  selectedBankCode,
  onSelect,
}) {
  const { t } = useTranslation();
  const colors = useThemeColors();

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="2xl"
      scrollBehavior="inside"
    >
      <ModalContent style={{ backgroundColor: colors.background.card }}>
        <ModalHeader style={{ color: colors.text.primary }}>
          {t("tutorOnboarding.bankModalTitle")}
        </ModalHeader>
        <ModalBody className="pb-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {BANK_LIST.map((bank) => (
              <button
                key={bank.code}
                type="button"
                onClick={() => onSelect(bank)}
                className="flex flex-col items-center gap-2.5 p-3 rounded-xl border transition-all hover:scale-[1.02]"
                style={{
                  backgroundColor:
                    selectedBankCode === bank.code
                      ? `${colors.primary.main}18`
                      : colors.background.gray,
                  borderColor:
                    selectedBankCode === bank.code
                      ? colors.primary.main
                      : "transparent",
                }}
              >
                <div className="w-full h-12 flex items-center justify-center">
                  <img
                    src={bank.logo}
                    alt={bank.name}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
                <span
                  className="text-xs text-center leading-tight font-medium line-clamp-2 w-full"
                  style={{ color: colors.text.primary }}
                >
                  {bank.name}
                </span>
              </button>
            ))}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
