const natural = require('natural');
const readline = require('readline');

const classifier = new natural.BayesClassifier();

classifier.addDocument('Kenapa bjr saya berubah setiap bulan?', 'AGRONOMI');
classifier.addDocument('Kenapa bjr saya tidak sesuai dengan bulan lalu?', 'AGRONOMI');
classifier.addDocument('Kenapa bjr saya tidak sesuai dengan catatan mandor', 'AGRONOMI');
classifier.addDocument('Ada yang main bjr di afdeling', 'AGRONOMI');

classifier.addDocument('Kenapa catatan janjang saya beda di gajihan?', 'AGRONOMI');
classifier.addDocument('Ada permainan janjang Angin di afdeling', 'AGRONOMI');
classifier.addDocument('Ada janjang saya yang hilang dan tidak dibayar oleh perusahaan', 'AGRONOMI');
classifier.addDocument('Kenapa Janjang saya selisih dengan gajihan?', 'AGRONOMI');

classifier.addDocument('Kenapa brondolan saya tidak dibayar?', 'AGRONOMI');
classifier.addDocument('Ada permainan brondolan di afdeling', 'AGRONOMI');
classifier.addDocument('Brondolan saya dengan catatan mandor selisih', 'AGRONOMI');

classifier.addDocument('Asisten afdeling tidak perhatian dengan karyawan', 'AGRONOMI');
classifier.addDocument('Asisten tidak peduli dengan karyawan', 'AGRONOMI');
classifier.addDocument('Asisten tidak pernah apel pagi', 'AGRONOMI');
classifier.addDocument('Asisten ada main di afdeling', 'AGRONOMI');

classifier.addDocument('Mandor afdeling tidak perhatian dengan karyawan', 'AGRONOMI');
classifier.addDocument('Mandor tidak peduli dengan karyawan', 'AGRONOMI');
classifier.addDocument('Mandor tidak pernah apel pagi', 'AGRONOMI');
classifier.addDocument('Mandor ada main di afdeling', 'AGRONOMI');
classifier.addDocument('Respon mandor lambat ketika ada komplain dari karyawan', 'AGRONOMI');
classifier.addDocument('Mandor kurang persuasif terhadap permasalahan karyawan', 'AGRONOMI');
classifier.addDocument('Selisih pendapatan dengan pemanen yang lain', 'AGRONOMI');
classifier.addDocument('Ditemukan Restan di dalam block', 'AGRONOMI');
classifier.addDocument('Ada yang titip Janjang atau brondolan dengan mandor', 'AGRONOMI');

classifier.addDocument('Alat Panen Rusak perlu diperbaiki', 'AGRONOMI');
classifier.addDocument('Angkong Rusak perlu diperbaiki', 'AGRONOMI');
classifier.addDocument('Bearing Rusak', 'AGRONOMI');

classifier.addDocument('Selisih Gaji', 'FINANCE');
classifier.addDocument('Gaji banyak potongan', 'FINANCE');
classifier.addDocument('Gantungan gaji tidak dibayar', 'FINANCE');
classifier.addDocument('Kontantan terlambat kasih uangnya', 'FINANCE');
classifier.addDocument('Ada yang nitip gaji dengan mandor atau karyawan yang lain', 'FINANCE');

classifier.addDocument('Bagaimana perhitungan janjang', 'FINANCE');
classifier.addDocument('Kenapa Gaji saya tidak sesuai?', 'FINANCE');
classifier.addDocument('Kenapa Gaji saya tidak dibayar?', 'FINANCE');

classifier.addDocument('Rumah kondisi tidak layak', 'TEKNIK');
classifier.addDocument('Lantai rumah rusak perlu diperbaiki', 'TEKNIK');
classifier.addDocument('Atap Bocor ketika hujan', 'TEKNIK');
classifier.addDocument('Lingkungan perumahan kotor dan tidak layak', 'TEKNIK');
classifier.addDocument('Septictank rusak tidak pernah diperbaiki', 'TEKNIK');
classifier.addDocument('Kamar Mandi tidak berfungsi', 'TEKNIK');
classifier.addDocument('Air tidak masuk ke kamar mandi', 'TEKNIK');
classifier.addDocument('Kondisi Kamar mandi tidak layak', 'TEKNIK');

classifier.addDocument('Kenapa saya tidak mendapat kartu BPJS', 'PERSONALIA');
classifier.addDocument('Kenapa JAMSOSTEK saya tidak berfungsi', 'PERSONALIA');

classifier.addDocument('Kenapa Insentif saya tidak dibayar', 'PERSONALIA');
classifier.addDocument('Insentif saya tidak dibayar sesuai dengan aturan', 'PERSONALIA');

classifier.addDocument('Penempatan karyawan baru lambat', 'PERSONALIA');
classifier.addDocument('Konsumsi Karyawan baru terlambat diberikan', 'PERSONALIA');
classifier.addDocument('Permintaan penggantian mandor atau asisten', 'PERSONALIA');

classifier.train();

module.exports = classifier;