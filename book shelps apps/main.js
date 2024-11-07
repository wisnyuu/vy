let title = document.getElementById('bookFormTitle');
let author = document.getElementById('bookFormAuthor');
let year = document.getElementById('bookFormYear');
let inComplete = document.getElementById('incompleteBookList');
let complete = document.getElementById('completeBookList');
let bookFormIsComplete = document.getElementById('bookFormIsComplete');
let submitButton = document.getElementById('bookSubmit');
let searchBox = document.getElementById('searchBookTitle');
let searchButton = document.getElementById('searchSubmit');
let searchResult = document.getElementById('searchResult');

bookFormIsComplete.addEventListener('change', function() {
    if (this.checked) {
        submitButton.innerText = "Masukkan Buku ke rak Selesai Dibaca";
    } else {
        submitButton.innerText = "Masukkan Buku ke rak Belum Selesai Dibaca";
    }
});

function masuk(event) {
    event.preventDefault();
    
    let bookTitle = title.value;
    let bookAuthor = author.value;
    let bookYear = parseInt(year.value);
    let isComplete = bookFormIsComplete.checked;
    
    // Validasi input
    if (!bookTitle || !bookAuthor || !bookYear) {
        showNotification('Semua field harus diisi!', 'error');
        return;
    }
    
    let buku = {
        id: Number(Date.now()),
        title: bookTitle,
        author: bookAuthor,
        year: bookYear,
        isComplete: isComplete
    };
    
    let bukuList = JSON.parse(localStorage.getItem('bukuList')) || [];
    bukuList.push(buku);
    localStorage.setItem('bukuList', JSON.stringify(bukuList));
    
    console.log('Buku yang disimpan:', bukuList); // Debugging log
    
    tampilkanBuku(buku);
    
    // Reset form
    title.value = '';
    author.value = '';
    year.value = '';
    bookFormIsComplete.checked = false;
    submitButton.innerText = "Masukkan Buku ke rak Belum Selesai Dibaca";
    
    // Tampilkan notifikasi sukses
    showNotification(`Buku "${buku.title}" berhasil ditambahkan!`, 'success');
}

function tampilkanBuku(buku) {
    let bukuItem = document.createElement('div');
    bukuItem.setAttribute('data-bookid', buku.id);
    bukuItem.setAttribute('data-testid', 'bookItem');
    bukuItem.classList.add('book_item');
    bukuItem.innerHTML = `
        <h3 data-testid="bookItemTitle">${buku.title}</h3>
        <p data-testid="bookItemAuthor">Penulis: ${buku.author}</p>
        <p data-testid="bookItemYear">Tahun: ${buku.year}</p>
        <div class="action">
            <button class="${buku.isComplete ? 'green' : 'green'}" onclick="ubahStatusBuku(${buku.id})" data-testid="bookItemIsCompleteButton">
                ${buku.isComplete ? 'Belum selesai di Baca' : 'Selesai dibaca'}
            </button>
            <button class="red" onclick="hapusBuku(${buku.id})" data-testid="bookItemDeleteButton">Hapus buku</button>
        </div>
    `;
    
    if (buku.isComplete) {
        complete.appendChild(bukuItem);
    } else {
        inComplete.appendChild(bukuItem);
    }
}

function ubahStatusBuku(id) {
    let bukuList = JSON.parse(localStorage.getItem('bukuList')) || [];
    let buku = bukuList.find(b => b.id === id);
    if (buku) {
        buku.isComplete = !buku.isComplete;
        localStorage.setItem('bukuList', JSON.stringify(bukuList));
        tampilkanSemuaBuku();
        
        // Tampilkan notifikasi status buku berubah
        const status = buku.isComplete ? 'selesai dibaca' : 'belum selesai dibaca';
        showNotification(`Buku "${buku.title}" telah ditandai sebagai ${status}.`, 'success');
    }
}

function hapusBuku(id) {
    let bukuList = JSON.parse(localStorage.getItem('bukuList')) || [];
    let buku = bukuList.find(b => b.id === id);
    if (buku) {
        bukuList = bukuList.filter(buku => buku.id !== id);
        localStorage.setItem('bukuList', JSON.stringify(bukuList));
        tampilkanSemuaBuku();
        // Tampilkan notifikasi buku dihapus
        showNotification(`Buku "${buku.title}" berhasil dihapus.`, 'success');
    }
}

function tampilkanSemuaBuku() {
    searchResult.innerHTML = '';
    inComplete.innerHTML = '';
    complete.innerHTML = '';
    inComplete.style.display = 'block';
    complete.style.display = 'block';
    let bukuList = JSON.parse(localStorage.getItem('bukuList')) || [];
    bukuList.forEach(buku => tampilkanBuku(buku));
}

tampilkanSemuaBuku();

// Inisialisasi teks tombol saat halaman dimuat
submitButton.innerText = "Masukkan Buku ke rak Belum Selesai Dibaca";

searchButton.addEventListener('click', function(e) {
    e.preventDefault();
    searchBuku(searchBox.value);
});

function searchBuku(keyword) {
    keyword = keyword.toLowerCase();
    let bukuList = JSON.parse(localStorage.getItem('bukuList')) || [];
    let hasilPencarian = bukuList.filter(buku => 
        buku.title.toLowerCase().includes(keyword)
    );

    searchResult.innerHTML = '';

    inComplete.style.display = 'none';
    complete.style.display = 'none';

    if (hasilPencarian.length > 0) {
        hasilPencarian.forEach(buku => {
            let bukuItem = createBukuElement(buku);
            searchResult.appendChild(bukuItem);
        });
    } else {
        let pesanTidakDitemukan = document.createElement('p');
        pesanTidakDitemukan.textContent = 'Buku tidak ditemukan';
        searchResult.appendChild(pesanTidakDitemukan);
    }
}

function createBukuElement(buku) {
    let bukuItem = document.createElement('div');
    bukuItem.setAttribute('data-bookid', buku.id);
    bukuItem.setAttribute('data-testid', 'bookItem');
    bukuItem.classList.add('book_item');
    bukuItem.innerHTML = `
        <h3 data-testid="bookItemTitle">${buku.title}</h3>
        <p data-testid="bookItemAuthor">author: ${buku.author}</p>
        <p data-testid="bookItemYear">year: ${buku.year}</p>
        <p data-testid="buku-status">Status: ${buku.isComplete ? 'Selesai dibaca' : 'Belum selesai dibaca'}</p>
        <div class="action">
            <button class="${buku.isComplete ? 'red' : 'red'}" onclick="ubahStatusBuku(${buku.id})" data-testid="bookItemIsCompleteButton">
                ${buku.isComplete ? 'Belum selesai di Baca' : 'Selesai dibaca'}
            </button>
            <button class="red" onclick="hapusBuku(${buku.id})" data-testid="bookItemDeleteButton">Hapus buku</button>
        </div>
    `;
    return bukuItem;
}

// Tambahkan event listener untuk reset pencarian saat input kosong
searchBox.addEventListener('input', function() {
    if (this.value === '') {
        tampilkanSemuaBuku();
    }
});

// Tambahkan fungsi untuk menampilkan notifikasi
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    
    // Tambahkan class show untuk memunculkan notifikasi
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Hilangkan notifikasi setelah 3 detik
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}
