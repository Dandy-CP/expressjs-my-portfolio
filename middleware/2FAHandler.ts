import * as OTPAuth from "otpauth";
import QRCode from "qrcode";

interface IType2FA {
  methode: "enable" | "verify";
  label: string;
  secret_totp?: string;
}

let base32_secret = new OTPAuth.Secret({ size: 20 }).base32;
let totp = new OTPAuth.TOTP({
  issuer: "Personal Website",
  algorithm: "SHA1",
  digits: 6,
});

const handler2FA = async ({ methode, label, secret_totp }: IType2FA) => {
  switch (methode) {
    case "enable":
      totp.label = `User ${label}`;
      totp.secret = OTPAuth.Secret.fromBase32(base32_secret);

      let otpauth_url = OTPAuth.URI.stringify(totp);

      const qr = await QRCode.toDataURL(otpauth_url);

      return {
        qrCode: qr,
        secret: base32_secret,
      };
    case "verify":
      totp.label = `User ${label}`;
      totp.secret = OTPAuth.Secret.fromBase32(secret_totp);

      const token = totp.generate();

      return {
        token: token,
      };
  }
};

export default handler2FA;
