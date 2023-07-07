/* eslint-disable no-undef */
const P = BigInt(
    "0x1ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
);

const A = BigInt(
    "6864797660130609714981900799081393217269435300143305409394463459185543183397656052122559640661454554977296311391480858037121987999716643812574028291115057148"
);

const B = BigInt(
    "1093849038073734274511112390766805569936207598951683748994586394495953116150735016013708737573759623248592132296706313309438452531591012912142327488478985984"
);

const Gx = BigInt(
    "0x0c6858e06b70404e9cd9e3ecb662395b4429c648139053fb521f828af606b4d3dbaa14b5e77efe75928fe1dc127a2ffa8de3348b3c1856a429bf97e7e31c2e5bd66"
);

const Gy = BigInt(
    "0x11839296a789a3bc0045c8a5fb42c7d1bd998f54449579b446817afbd17273e662c97ee72995ef42640c550b9013fad0761353c7086a272c24088be94769fd16650"
);

const GP = [Gx, Gy];

const N = BigInt(
    "0x1fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffa51868783bf2f966b7fcc0148f709a5d03bb5c9b8899c47aebb6fb71e91386409"
);
  
class ECC {
    constructor() {
        //this.k = BigInt(random.getrandbits(256));
        this.k = BigInt(
            "70204765695303852510765200745323365647219695395503892545421360627448806975859"
        );
        console.log("k", this.k);
    }
  
    encAscii(character) {
        return BigInt(character.charCodeAt(0)) << BigInt(2);
    }
  
    decAscii(asciiVal) {
        return Number(BigInt(asciiVal) >> BigInt(2));
    }
  
    encode(msg) {
        let encodedString = "";
        for (let i = 0; i < msg.length; i++) {
            encodedString += String(this.encAscii(msg[i]));
        }
        return encodedString;
    }
  
    decode(encAscii_string) {
        let pack = "";
        let i = 0;
        let decodedString = "";
        console.log("encAscii_string String", encAscii_string);
        while (i < String(encAscii_string).length) {
            pack = encAscii_string.substr(i, 3);
            console.log("pack", pack);
            console.log("pack des", this.decAscii(pack));
            decodedString += String.fromCharCode(this.decAscii(pack));
            i = i + 3;
        }
        console.log("decoded String", decodedString);
        return decodedString;
    }
  
    modInverse(a, n = P) {
        let lowM = BigInt(1);
        let highM = BigInt(0);
        let low = BigInt(a) % BigInt(n);
        let high = BigInt(n);
        while (low > BigInt(1)) {
            const r = high / low;
            const nm = highM - lowM * r;
            const new_ = high - low * r;
            lowM = nm;
            low = new_;
            highM = BigInt(lowM);
            high = BigInt(low);
        }
        return lowM % BigInt(n);
    }
  
    eccAddition(a, b) {
        const LamAdd = ((b[1] - a[1]) * this.modInverse(b[0] - a[0], P)) % P;
        const x = (LamAdd * LamAdd - a[0] - b[0]) % P;
        const y = (LamAdd * (a[0] - x) - a[1]) % P;
        return [x, y];
    }
  
    ecTwoFold(a) {
        const Lam =
            ((BigInt(3) * a[0] * a[0] + A) * this.modInverse(BigInt(2) * a[1], P)) %
            P;
        const x = (Lam * Lam - BigInt(2) * a[0]) % P;
        const y = (Lam * (a[0] - x) - a[1]) % P;
        return [x, y];
    }
  
    eccDot(generatedPoint, constK) {
        console.log("constK", constK); // Double & add. Not true multiplication
        const constKBin = constK.toString(2);
        console.log("constKBin", constKBin);
        let Q = generatedPoint;
        console.log("generated point", generatedPoint);
        // this is a optimised implementaion for faster multiplication
        for (let i = 1; i < constKBin.length; i++) {
            Q = this.ecTwoFold(Q);
            if (constKBin[i] === "1") {
            Q = this.eccAddition(Q, generatedPoint);
            }
        }
        console.log("Q", Q);
        return Q;
    }
  
    gen_pubKey(privKey) {
        const PublicKey = this.eccDot(GP, privKey);
        return PublicKey;
    }
  
    encryption(Public_Key, msg) {
        msg = this.encode(msg);
        const C1 = this.eccDot(GP, this.k);
        const C2 = this.eccDot(Public_Key, this.k)[0] + BigInt(msg);
        return [C1, C2];
    }
  
    decryption(C1, C2, private_Key) {
        console.log("c1 solu", C1);
        console.log("c2 solu", C2);
        console.log("c3 private", private_Key);
        const solution = C2 - this.eccDot(C1, private_Key)[0];
        console.log("solution", solution);
        return this.decode(String(solution));
    }
}
  
export default ECC;
  