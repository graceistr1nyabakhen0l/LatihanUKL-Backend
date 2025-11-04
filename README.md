🏛 Deskripsi Arsitektur Restful API (NestJS + MySQL)
Menggunakan NestJS berarti kita menganut pola arsitektur modular dengan pendekatan Controller-Service-Module untuk memastikan API mudah diuji (testable), maintainable, dan terstruktur.

1. Struktur Modul Utama
| Modul | Tugas Utama | Keterangan |
|---|---|---|
| AuthModule | Autentikasi & Otorisasi | Menangani logika login, registrasi, pembuatan, dan validasi JWT. |
| UsersModule | Pengelolaan Data Pengguna | Menangani operasi CRUD (Create, Read, Update, Delete) pada data siswa dan karyawan (tabel users). |
| AttendanceModule | Pencatatan Kehadiran | Menangani logika bisnis untuk check-in, check-out, dan pengambilan riwayat presensi (tabel attendance). |
| DatabaseModule | Koneksi Database | Mengelola koneksi ke MySQL, biasanya melalui TypeORM atau Sequelize. |

2. Konsep Model Data (Entity MySQL)
Data disimpan dalam tabel-tabel MySQL dengan relasi sebagai berikut:
 * User Entity: Merepresentasikan tabel users. Entitas ini berelasi satu-ke-banyak dengan Attendance (Satu User bisa memiliki banyak catatan Presensi). Entitas ini juga menyimpan hash dari password menggunakan Bcrypt.
 * Attendance Entity: Merepresentasikan tabel attendance. Menyimpan user_id sebagai Foreign Key ke tabel users, serta kolom waktu (check_in_time, check_out_time) dan lokasi (latitude, longitude).

3. Implementasi Keamanan (Token Autentikasi)
A. Proses Login (AuthModule)
 * Controller menerima UserLoginDto (username, password).
 * Auth Service memverifikasi username di database.
 * Auth Service membandingkan password yang masuk dengan password hash yang tersimpan menggunakan Bcrypt.
 * Jika valid, Auth Service menggunakan JWT Service untuk membuat token yang berisi payload (minimal id dan role pengguna).
 * Controller mengembalikan token ini (misalnya di kolom token respons) dan kode status 200 OK.
B. Proteksi Endpoint (Menggunakan Guard)
 * Setiap endpoint yang perlu dilindungi (misalnya check-in, update user) akan ditandai dengan @UseGuards(JwtAuthGuard) di dalam Controller.
 * Ketika request masuk, JwtAuthGuard akan memeriksa Header Authorization: Bearer <token>.
 * Guard akan memanggil Passport Strategy untuk memverifikasi token: jika token valid dan belum kadaluarsa, data payload (yaitu id dan role pengguna) akan secara otomatis disisipkan ke objek req.user.
 * Jika token tidak valid, request diblokir dengan kode status 401 Unauthorized atau 403 Forbidden.

4. Proses Bisnis Utama: Presensi Masuk (Check-In)
Endpoint: POST /api/v1/attendance/check-in
 * Controller (AttendanceController) menerima request yang sudah lolos JWT Guard. Data lokasi masuk ke dalam CheckInDto.
 * Controller memanggil Attendance Service, meneruskan userId (dari token) dan CheckInDto.
 * Attendance Service melakukan validasi business logic:
 * Validasi Kehadiran Harian: Service melakukan query ke tabel attendance MySQL untuk mengecek apakah user_id yang bersangkutan sudah memiliki catatan check_in_time pada tanggal hari ini.
 * (Opsi Lanjutan) Validasi Lokasi: Service dapat membandingkan latitude dan longitude yang dikirim dengan data lokasi kantor/sekolah yang valid di database.
 * Jika validasi sukses, Attendance Service membuat record baru di tabel attendance dengan waktu saat ini.
 * Controller mengembalikan AttendanceResponseDto dan kode status 201 Created.