/* ============================================================
   PLACEHOLDER DATA
   แก้ไขข้อมูลตรงนี้เพื่อใส่ชื่อเด็กฝึก, รูปภาพ, และรายละเอียดจริง
   ============================================================ */

const AVATAR_GRADIENTS = [
  ["#67E0FF","#8FE9FF"],["#FFBDD9","#FFD6E7"],["#67E0FF","#FFBDD9"],
  ["#9AE8FF","#67E0FF"],["#FFCFE1","#FFBDD9"],["#7FD8FF","#B7ECFF"]
];

const TRAINEES_B = [
  { id: "B01", side: "B", number: "01", name: "Philip Chae", stageName: "Philip Chae", position: "Vocal", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#67E0FF","#8FE9FF"] },
  { id: "B02", side: "B", number: "02", name: "Seung Gicheol", stageName: "Moirae", position: "Rap", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#FFBDD9","#FFD6E7"] },
  { id: "B03", side: "B", number: "03", name: "Muntai Banna", stageName: "Mun", position: "Dance", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#67E0FF","#FFBDD9"] },
  { id: "B04", side: "B", number: "04", name: "Choi Myeongmun", stageName: "MM", position: "Vocal / Dance", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#9AE8FF","#67E0FF"] },
  { id: "B05", side: "B", number: "05", name: "Arlan Felaytin", stageName: "Firas", position: "Rap / Dance", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#FFCFE1","#FFBDD9"] },
  { id: "B06", side: "B", number: "06", name: "Sa Haerang", stageName: "zoren", position: "Vocal", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#7FD8FF","#B7ECFF"] },
  { id: "B07", side: "B", number: "07", name: "Fujita Chiharu", stageName: "CHIHARU", position: "Rap", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#67E0FF","#8FE9FF"] },
  { id: "B08", side: "B", number: "08", name: "Asher Hwang", stageName: "ASH", position: "Dance", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#FFBDD9","#FFD6E7"] },
  { id: "B09", side: "B", number: "09", name: "Akekapob Inchayanon", stageName: "ZERO", position: "Vocal / Dance", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#67E0FF","#FFBDD9"] },
  { id: "B10", side: "B", number: "10", name: "Wanwiwa Saeheng", stageName: "Padpha", position: "Rap / Dance", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#9AE8FF","#67E0FF"] },
  { id: "B11", side: "B", number: "11", name: "Jia Lu Yang", stageName: "April", position: "Vocal", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#FFCFE1","#FFBDD9"] },
  { id: "B12", side: "B", number: "12", name: "Thun Pacharaanan", stageName: "DEC", position: "Rap", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#7FD8FF","#B7ECFF"] },
  { id: "B13", side: "B", number: "13", name: "Sakurai Kureha", stageName: "KUREHA", position: "Dance", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#67E0FF","#8FE9FF"] },
  { id: "B14", side: "B", number: "14", name: "Sakuratani Madoka", stageName: "Madoka", position: "Vocal / Dance", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#FFBDD9","#FFD6E7"] },
  { id: "B15", side: "B", number: "15", name: "Choi Ian", stageName: "IAN", position: "Rap / Dance", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#67E0FF","#FFBDD9"] },
  { id: "B16", side: "B", number: "16", name: "Thitiphum Wilailak", stageName: "TanRak", position: "Vocal", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#9AE8FF","#67E0FF"] },
  { id: "B17", side: "B", number: "17", name: "Noah Serrano", stageName: "NoNo", position: "Rap", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#FFCFE1","#FFBDD9"] },
  { id: "B18", side: "B", number: "18", name: "Yuan Dongyang", stageName: "Daylen", position: "Dance", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#7FD8FF","#B7ECFF"] },
  { id: "B19", side: "B", number: "19", name: "Kyoukuanjou Kazuha", stageName: "Cheomin", position: "Vocal / Dance", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#67E0FF","#8FE9FF"] },
  { id: "B20", side: "B", number: "20", name: "Dustin Xuan", stageName: "Juodas", position: "Rap / Dance", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#FFBDD9","#FFD6E7"] },
  { id: "B21", side: "B", number: "21", name: "Hikiba Yoshimi", stageName: "KEY", position: "Vocal", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#67E0FF","#FFBDD9"] },
  { id: "B22", side: "B", number: "22", name: "No Haneul", stageName: "Noelle", position: "Rap", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#9AE8FF","#67E0FF"] },
  { id: "B23", side: "B", number: "23", name: "Jinguuji Arianne", stageName: "Arian", position: "Dance", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#FFCFE1","#FFBDD9"] },
  { id: "B24", side: "B", number: "24", name: "Souda Taiji", stageName: "Taiji", position: "Vocal / Dance", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#7FD8FF","#B7ECFF"] },
  { id: "B25", side: "B", number: "25", name: "Zelda Altan", stageName: "Zelda", position: "Rap / Dance", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#67E0FF","#8FE9FF"] },
  { id: "B26", side: "B", number: "26", name: "Jirateep Akkaraanansakul", stageName: "Jojira", position: "Vocal", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#FFBDD9","#FFD6E7"] },
  { id: "B27", side: "B", number: "27", name: "Lǐ Yuèlán", stageName: "LUE", position: "Rap", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#67E0FF","#FFBDD9"] },
  { id: "B28", side: "B", number: "28", name: "Wongwayu Asaneewat", stageName: "FIERCE", position: "Dance", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#9AE8FF","#67E0FF"] },
  { id: "B29", side: "B", number: "29", name: "Dylan Xuan", stageName: "Baltas", position: "Vocal / Dance", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#FFCFE1","#FFBDD9"] },
  { id: "B30", side: "B", number: "30", name: "Luo Airen", stageName: "AIREN", position: "Rap / Dance", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#7FD8FF","#B7ECFF"] },
  { id: "B31", side: "B", number: "31", name: "Kaida Toshiki", stageName: "TOSHIKI", position: "Vocal", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#67E0FF","#8FE9FF"] },
  { id: "B32", side: "B", number: "32", name: "Brooklyn Aide Flake", stageName: "AIDE", position: "Rap", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#FFBDD9","#FFD6E7"] },
  { id: "B33", side: "B", number: "33", name: "Tanadol charoenhiranphong", stageName: "Honey apple", position: "Dance", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#67E0FF","#FFBDD9"] },
  { id: "B34", side: "B", number: "34", name: "Phakin​ Hartwell", stageName: "Flint", position: "Vocal / Dance", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#9AE8FF","#67E0FF"] },
  { id: "B35", side: "B", number: "35", name: "Kwin Chwe", stageName: "Yamato", position: "Rap / Dance", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#FFCFE1","#FFBDD9"] },
  { id: "B36", side: "B", number: "36", name: "Ronrae Panejohn", stageName: "RJohn", position: "Vocal", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#7FD8FF","#B7ECFF"] },
  { id: "B37", side: "B", number: "37", name: "Pakkanan Manawach", stageName: "Shirosaki Rui", position: "Rap", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#67E0FF","#8FE9FF"] },
  { id: "B38", side: "B", number: "38", name: "Jinnapat Akarawat", stageName: "JENQ", position: "Dance", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#FFBDD9","#FFD6E7"] },
  { id: "B39", side: "B", number: "39", name: "Kieran Ajin Chotikul", stageName: "RAN", position: "Vocal / Dance", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#67E0FF","#FFBDD9"] },
  { id: "B40", side: "B", number: "40", name: "Keetaphat Jirathiwat", stageName: "puzzle", position: "Rap / Dance", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#9AE8FF","#67E0FF"] }
];

const TRAINEES_G = [
  { id: "G01", side: "G", number: "01", name: "Marita Chatsaweth", stageName: "Marita", position: "Vocal", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#FFBDD9","#FFD6E7"] },
  { id: "G02", side: "G", number: "02", name: "Fujihara Nanami", stageName: "Nanami", position: "Rap", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#FFCFE1","#FFBDD9"] },
  { id: "G03", side: "G", number: "03", name: "Koharu Fujimoto", stageName: "Koharu", position: "Dance", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#FFBDD9","#FFD6E7"] },
  { id: "G04", side: "G", number: "04", name: "Rihara Karin", stageName: "Karin", position: "Vocal / Dance", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#FFCFE1","#FFBDD9"] },
  { id: "G05", side: "G", number: "05", name: "Dujdao Lhaoarun", stageName: "Dujdao", position: "Rap / Dance", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#FFBDD9","#FFD6E7"] },
  { id: "G06", side: "G", number: "06", name: "Ame Arima", stageName: "Ame", position: "Vocal", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#FFCFE1","#FFBDD9"] },
  { id: "G07", side: "G", number: "07", name: "Lee Seolha", stageName: "Seolha", position: "Rap", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#FFBDD9","#FFD6E7"] },
  { id: "G08", side: "G", number: "08", name: "Falin Hartwell", stageName: "Falin", position: "Dance", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#FFCFE1","#FFBDD9"] },
  { id: "G09", side: "G", number: "09", name: "Hong Charang", stageName: "Charang", position: "Vocal / Dance", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#FFBDD9","#FFD6E7"] },
  { id: "G10", side: "G", number: "10", name: "Naoki Sukkatiwanan", stageName: "Naoki", position: "Rap / Dance", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#FFCFE1","#FFBDD9"] },
  { id: "G11", side: "G", number: "11", name: "Aotsuki Kotone", stageName: "Kotone", position: "Vocal", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#FFBDD9","#FFD6E7"] },
  { id: "G12", side: "G", number: "12", name: "An Yarin", stageName: "Yarin", position: "Rap", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#FFCFE1","#FFBDD9"] },
  { id: "G13", side: "G", number: "13", name: "Kuno Kokono", stageName: "Kokono", position: "Dance", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#FFBDD9","#FFD6E7"] },
  { id: "G14", side: "G", number: "14", name: "Rinrada Shinozaki", stageName: "Rinrada", position: "Vocal / Dance", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#FFCFE1","#FFBDD9"] },
  { id: "G15", side: "G", number: "15", name: "Rosemarie Romanovna Rostova", stageName: "Rosemarie", position: "Rap / Dance", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#FFBDD9","#FFD6E7"] },
  { id: "G16", side: "G", number: "16", name: "Pirin Ariyakul", stageName: "Pirin", position: "Vocal", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#FFCFE1","#FFBDD9"] },
  { id: "G17", side: "G", number: "17", name: "Lin Xinyan", stageName: "Xinyan", position: "Rap", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#FFBDD9","#FFD6E7"] },
  { id: "G18", side: "G", number: "18", name: "Thonica Khumkham", stageName: "Thonica", position: "Dance", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#FFCFE1","#FFBDD9"] },
  { id: "G19", side: "G", number: "19", name: "Siriyada Pimchanok", stageName: "Siriyada", position: "Vocal / Dance", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#FFBDD9","#FFD6E7"] },
  { id: "G20", side: "G", number: "20", name: "Priyawadee Chanwarasakul", stageName: "Priyawadee", position: "Rap / Dance", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#FFCFE1","#FFBDD9"] },
  { id: "G21", side: "G", number: "21", name: "Yoo Hanbyeol", stageName: "Hanbyeol", position: "Vocal", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#FFBDD9","#FFD6E7"] },
  { id: "G22", side: "G", number: "22", name: "Daraling Proudsawang", stageName: "Daraling", position: "Rap", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#FFCFE1","#FFBDD9"] },
  { id: "G23", side: "G", number: "23", name: "Harin Yoon", stageName: "Harin", position: "Dance", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#FFBDD9","#FFD6E7"] },
  { id: "G24", side: "G", number: "24", name: "Melinda Supicha", stageName: "Melinda", position: "Vocal / Dance", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#FFCFE1","#FFBDD9"] },
  { id: "G25", side: "G", number: "25", name: "Aiyada Rattanavaroon", stageName: "Aiyada", position: "Rap / Dance", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#FFBDD9","#FFD6E7"] },
  { id: "G26", side: "G", number: "26", name: "Nawasa Aranrak", stageName: "Nawasa", position: "Vocal", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#FFCFE1","#FFBDD9"] },
  { id: "G27", side: "G", number: "27", name: "Pinyada Matthanitrinapatchara", stageName: "Pinyada", position: "Rap", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#FFBDD9","#FFD6E7"] },
  { id: "G28", side: "G", number: "28", name: "Lapassara Tominaga", stageName: "Lapassara", position: "Dance", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#FFCFE1","#FFBDD9"] },
  { id: "G29", side: "G", number: "29", name: "Erica Niran Chotikul", stageName: "Erica", position: "Vocal / Dance", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#FFBDD9","#FFD6E7"] },
  { id: "G30", side: "G", number: "30", name: "Maneechan Saengngam", stageName: "Maneechan", position: "Rap / Dance", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#FFCFE1","#FFBDD9"] },
  { id: "G31", side: "G", number: "31", name: "Phonnapphan Dex Lawley", stageName: "Phonnapphan", position: "Vocal", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#FFBDD9","#FFD6E7"] },
  { id: "G32", side: "G", number: "32", name: "Pimbupha Saelim", stageName: "Pimbupha", position: "Rap", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#FFCFE1","#FFBDD9"] },
  { id: "G33", side: "G", number: "33", name: "Hashimoto Reina", stageName: "Reina", position: "Dance", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#FFBDD9","#FFD6E7"] },
  { id: "G34", side: "G", number: "34", name: "Rumi Tatiana", stageName: "Rumi", position: "Vocal / Dance", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#FFCFE1","#FFBDD9"] },
  { id: "G35", side: "G", number: "35", name: "Uiharu Kanase", stageName: "Uiharu", position: "Rap / Dance", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#FFBDD9","#FFD6E7"] },
  { id: "G36", side: "G", number: "36", name: "Péi Ruòníng", stageName: "Ruòníng", position: "Vocal", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#FFCFE1","#FFBDD9"] },
  { id: "G37", side: "G", number: "37", name: "Katya Mamiyo Cormier", stageName: "Katya", position: "Rap", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#FFBDD9","#FFD6E7"] },
  { id: "G38", side: "G", number: "38", name: "Renata Romanovna Rostova", stageName: "Renata", position: "Dance", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#FFCFE1","#FFBDD9"] },
  { id: "G39", side: "G", number: "39", name: "Aotsuki Kouha", stageName: "Kouha", position: "Vocal / Dance", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#FFBDD9","#FFD6E7"] },
  { id: "G40", side: "G", number: "40", name: "Mebara Tomiko", stageName: "Mebara", position: "Rap / Dance", hometown: "รอระบุ", birth: "รอระบุ", height: "— cm", intro: "โปรไฟล์เด็กฝึกคนนี้ยังไม่ได้ระบุรายละเอียด สามารถแก้ไขข้อมูลได้ในไฟล์ data.js", docLink: "", facebookLink: "", grad: ["#FFCFE1","#FFBDD9"] }
];

function makeTeams(side, trainees){
  const teams = [];
  for(let t=0; t<10; t++){
    const members = trainees.slice(t*4, t*4+4);
    teams.push({
      side,
      teamNumber: t+1,
      songTitle: "โจทย์เพลง — รอประกาศ",
      members
    });
  }
  return teams;
}
const TEAMS_B = makeTeams("B", TRAINEES_B);
const TEAMS_G = makeTeams("G", TRAINEES_G);

const NEWS_ITEMS = [
  {tag:"ประกาศ", title:"เปิดตัวเว็บไซต์ IDOL CAMP ASIA COMMU อย่างเป็นทางการ", desc:"ติดตามความเคลื่อนไหวของเด็กฝึกทั้ง 80 คนได้ที่นี่ ตลอดเส้นทางสู่การเดบิวต์"},
  {tag:"FIRST STAGE", title:"เปิดกลุ่ม Team Battle ครบทั้ง 20 ทีม", desc:"แบ่งฝั่งชาย-หญิงฝั่งละ 10 ทีม เตรียมประชันความสามารถในโจทย์เพลงแรก"},
  {tag:"PICK 'EM", title:"เปิดโหวตเด็กฝึกที่คุณชื่นชอบแล้ววันนี้", desc:"ร่วมส่งแรงใจให้เด็กฝึกคนโปรดของคุณผ่านหน้าโหวต Pick 'em"},
  {tag:"PROGRAM", title:"อัปเดตปฏิทินกิจกรรมประจำเดือน", desc:"ตรวจสอบวันถ่ายทำ วันออกอากาศ และวันปิดโหวตได้ในหน้า Program"}
];

const CAST_IMAGE_MAP = {
  "Millefeuille": "assets/Cast/Millefeuille.png",
  "Tian": "assets/Cast/Tian.png",
  "Khufahh": "assets/Cast/Khufahh.png",
  "Felix": "assets/Cast/Felix.png",
  "KAZE": "assets/Cast/KAZE.png",
  "Jeschire": "assets/Cast/Jeschire.png",
  "IRA": "assets/Cast/IRA.png"
};

// ปฏิทิน: key = "YYYY-M-D" (เดือนเริ่มที่ 0), value = array ของ event
const CALENDAR_EVENTS = {
  "2026-7-3":  [{type:"battle", label:"Team Battle Rehearsal"}],
  "2026-7-10": [{type:"broadcast", label:"EP.01 ออกอากาศ"}],
  "2026-7-15": [{type:"vote", label:"ปิดโหวต Pick 'em รอบ 1"}],
  "2026-7-20": [{type:"battle", label:"First Stage: Team Battle"}],
  "2026-7-24": [{type:"broadcast", label:"EP.02 ออกอากาศ"}],
  "2026-8-1":  [{type:"vote", label:"เปิดโหวตรอบ 2"}],
  "2026-8-7":  [{type:"broadcast", label:"EP.03 ออกอากาศ"}]
};