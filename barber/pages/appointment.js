document.addEventListener('DOMContentLoaded', () => {
    // ----- DOM ELEMENTLERİ -----
    const barberSelect = document.getElementById('barber-select');
    const calendarSection = document.getElementById('calendar-section'); // Takvim grid alanı
    const calendarWrapper = document.getElementById('calendar-wrapper'); // Takvimi ve başlığını saran div
    const appointmentTimesContainer = document.getElementById('appointment-times-container');
    const monthYearElement = document.getElementById('month-year');
    const daysElement = document.getElementById('calendar-days');
    const prevMonthButton = document.getElementById('prev-month');
    const nextMonthButton = document.getElementById('next-month');
    const appointmentDateTitle = document.getElementById('appointment-date-title');
    const appointmentList = document.getElementById('appointment-list');
    const activeAppointmentsList = document.getElementById('active-appointments-list');
    const noActiveAppointmentsMsg = document.getElementById('no-active-appointments');
    // Opsiyonel kullanıcı bilgisi ve çıkış
    const userInfo = document.getElementById('user-info');
    const userNamePlaceholder = document.getElementById('user-name-placeholder');
    const logoutButton = document.getElementById('logout-button');

    // ----- GLOBAL DEĞİŞKENLER -----
    let currentDate = new Date();
    let currentSelectedDateElement = null;
    let selectedBarberId = null;
    let currentBarberAvailability = {};
    const monthNames = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // ----- ÖRNEK VERİ (Simülasyon - Backend'den alınmalı) -----
    const barberAvailabilityData = {
        "berber_ali": { /* ... Ali'nin müsaitlikleri ... */
             "2025-04-28": [{ time: "13:00 – 14:00", available: 1 }, { time: "15:00 – 16:00", available: 1 }],
             "2025-04-29": [{ time: "10:00 – 11:00", available: 1 }, { time: "11:00 – 12:00", available: 1 }],
             "2025-05-01": [{ time: "10:00 – 11:00", available: 1 }, { time: "14:00 – 15:00", available: 1 }],
             "2025-05-02": [{ time: "09:00 – 10:00", available: 1 }, { time: "11:00 – 12:00", available: 0 }, { time: "15:00 – 16:00", available: 1 }],
        },
        "berber_veli": { /* ... Veli'nin müsaitlikleri ... */
             "2025-04-27": [{ time: "12:00 – 13:00", available: 1 }, { time: "14:00 – 15:00", available: 1 }], // Bugün için
             "2025-04-30": [{ time: "16:00 – 17:00", available: 1 }],
             "2025-05-01": [{ time: "11:00 – 12:00", available: 1 }, { time: "15:00 – 16:00", available: 1 }],
             "2025-05-02": [{ time: "10:00 – 11:00", available: 1 }, { time: "14:00 – 15:00", available: 1 }],
        },
        "berber_can": { /* ... Can'ın müsaitlikleri ... */
            "2025-04-29": [{ time: "14:00 – 15:00", available: 1 }],
            "2025-05-01": [{ time: "09:00 – 10:00", available: 0 }],
            "2025-05-03": [{ time: "13:00 – 14:00", available: 1 }],
        }
    };
     const sampleActiveAppointments = [
         { id: 'app1', barberId: 'berber_ali', barberName: 'Ali', date: '2025-05-01', time: '10:00 – 11:00' },
         { id: 'app2', barberId: 'berber_veli', barberName: 'Veli', date: '2025-05-02', time: '14:00 – 15:00' }
     ];

    // ----- BAŞLANGIÇ -----
    function initializePage() {
        // Kullanıcı oturumunu kontrol et (varsa)
        // loadUserInfo();

        // Aktif randevuları yükle ve göster
        fetchAndDisplayActiveAppointments();

        // Olay dinleyicileri ekle
        addEventListeners();
    }

    function addEventListeners() {
        barberSelect.addEventListener('change', handleBarberSelection);
        prevMonthButton.addEventListener('click', () => changeMonth(-1));
        nextMonthButton.addEventListener('click', () => changeMonth(1));
        // Aktif randevu listesindeki iptal butonları için olay delegasyonu
        activeAppointmentsList.addEventListener('click', handleActiveAppointmentActions);
    	logoutButton.addEventListener('click', handleLogout); // Opsiyonel
    }

    // ----- ANA İŞLEYİŞ FONKSİYONLARI -----

    function handleBarberSelection() {
        selectedBarberId = barberSelect.value;

        if (!selectedBarberId) {
            calendarWrapper.style.display = 'none';
            hideAppointmentTimes();
            currentBarberAvailability = {};
            return;
        }

        // Simülasyon: Seçili berber için veriyi yükle
        console.log(`Berber seçildi: ${selectedBarberId}. Veri yükleniyor...`);
        currentBarberAvailability = barberAvailabilityData[selectedBarberId] || {};

        // Takvimi göster ve render et
        calendarWrapper.style.display = 'block';
        currentDate = new Date();
        renderCalendar(currentDate.getFullYear(), currentDate.getMonth());
        hideAppointmentTimes();
    }

     function changeMonth(monthOffset) {
        if (!selectedBarberId) return;
        currentDate.setMonth(currentDate.getMonth() + monthOffset);
        renderCalendar(currentDate.getFullYear(), currentDate.getMonth());
    }


    function renderCalendar(year, month) {
        if (!selectedBarberId) return;

        daysElement.innerHTML = '';
        monthYearElement.textContent = `${monthNames[month].toUpperCase()} ${year}`;

        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const daysInMonth = lastDayOfMonth.getDate();
        let firstDayOfWeek = (firstDayOfMonth.getDay() === 0) ? 6 : firstDayOfMonth.getDay() - 1; // Pzt=0

        const lastDayOfPrevMonth = new Date(year, month, 0);
        const daysInPrevMonth = lastDayOfPrevMonth.getDate();

        let dayCounter = 1;
        let nextMonthDayCounter = 1;

        for (let i = 0; i < 42; i++) {
            const dayElement = document.createElement('div');
            dayElement.classList.add('calendar-day');
            let dayNumber, isCurrentMonth = false, dateString = '', currentDayFullDate = null;

            if (i < firstDayOfWeek) {
                dayNumber = daysInPrevMonth - firstDayOfWeek + i + 1;
                dayElement.classList.add('other-month');
                currentDayFullDate = new Date(year, month - 1, dayNumber);
            } else if (dayCounter <= daysInMonth) {
                dayNumber = dayCounter;
                isCurrentMonth = true;
                currentDayFullDate = new Date(year, month, dayNumber);
                dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
                dayCounter++;
            } else {
                dayNumber = nextMonthDayCounter;
                dayElement.classList.add('other-month');
                currentDayFullDate = new Date(year, month + 1, dayNumber);
                nextMonthDayCounter++;
            }

            const daySpan = document.createElement('span');
            daySpan.textContent = dayNumber;
            dayElement.appendChild(daySpan);

            if (isCurrentMonth) {
                const checkDate = new Date(currentDayFullDate);
                checkDate.setHours(0, 0, 0, 0);
                if (checkDate < today) {
                    dayElement.classList.add('past-day');
                } else {
                    dayElement.addEventListener('click', () => selectDate(dayElement, year, month, dayNumber, dateString));
                    // if (currentBarberAvailability[dateString]?.some(slot => slot.available > 0)) {
                    //     dayElement.classList.add('has-appointments'); // İsteğe bağlı
                    // }
                }
                if (checkDate.toDateString() === today.toDateString()) {
                    dayElement.classList.add('today');
                }
            }
            daysElement.appendChild(dayElement);
        }
        hideAppointmentTimes();
        if(currentSelectedDateElement) currentSelectedDateElement.classList.remove('selected');
        currentSelectedDateElement = null;
    }

    function selectDate(element, year, month, day, dateString) {
        if (element.classList.contains('past-day') || element.classList.contains('other-month')) return;
        if (currentSelectedDateElement) {
            currentSelectedDateElement.classList.remove('selected');
        }
        element.classList.add('selected');
        currentSelectedDateElement = element;
        const selectedDate = new Date(year, month, day);
        displayAppointmentTimes(selectedDate, dateString);
    }

    function displayAppointmentTimes(dateObject, dateKey) {
        if (!selectedBarberId) return;
        const barberName = barberSelect.options[barberSelect.selectedIndex].text;
        // Başlığı ayarla (örn: 28 Nisan 2025 Pazartesi)
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        appointmentDateTitle.textContent = `${dateObject.toLocaleDateString('tr-TR', options)} Saatleri (${barberName})`;
        appointmentList.innerHTML = ''; // Temizle

        // Simülasyon verisini kullan
        const times = currentBarberAvailability[dateKey] || [];
        const availableSlots = times.filter(slot => slot.available > 0);

        if (availableSlots.length === 0) {
            appointmentList.innerHTML = '<p class="muted-text">Müsait saat bulunmamaktadır.</p>';
        } else {
            availableSlots.forEach(slot => {
                const slotElement = document.createElement('div');
                slotElement.classList.add('appointment-slot');

                const timeInfoDiv = document.createElement('div');
                timeInfoDiv.classList.add('time-info');
                const timeRangeSpan = document.createElement('span');
                timeRangeSpan.classList.add('time-range');
                timeRangeSpan.innerHTML = `🕒 ${slot.time}`; // İkonu ekle
                const availabilitySpan = document.createElement('span');
                availabilitySpan.classList.add('availability');
                availabilitySpan.textContent = `${slot.available} KİŞİLİK YER`;
                timeInfoDiv.appendChild(timeRangeSpan);
                timeInfoDiv.appendChild(availabilitySpan);

                const bookButton = document.createElement('button');
                bookButton.classList.add('book-button');
                bookButton.textContent = 'RANDEVU AL'; // Veya sadece 'SEÇ'
                bookButton.addEventListener('click', () => { bookAppointment(dateKey, slot.time); });

                slotElement.appendChild(timeInfoDiv);
                slotElement.appendChild(bookButton);
                appointmentList.appendChild(slotElement);
            });
        }
        appointmentTimesContainer.style.display = 'block';
    }

    function hideAppointmentTimes() {
        appointmentTimesContainer.style.display = 'none';
        appointmentList.innerHTML = '';
        appointmentDateTitle.textContent = '3. Saat Seçiniz'; // Başlığı sıfırla
    }

    function bookAppointment(dateKey, timeSlot) {
        const barberName = barberSelect.options[barberSelect.selectedIndex].text;
        const confirmation = confirm(`Randevu Oluşturulacak:\n\nBerber: ${barberName}\nTarih: ${dateKey}\nSaat: ${timeSlot}\n\nOnaylıyor musunuz?`);
        if (confirmation) {
            console.log(`Randevu isteği (Simülasyon): Berber: ${selectedBarberId}, Tarih: ${dateKey}, Saat: ${timeSlot}`);
            // ---- Backend isteği burada yapılır ----
            alert("Randevu talebiniz başarıyla alındı (simülasyon).");
            // Başarılı ise aktif randevuları yenile
            fetchAndDisplayActiveAppointments();
            // ve belki saat listesini de yenile (backend'den çekerek)
             const selectedDate = new Date(dateKey.split('-')[0], dateKey.split('-')[1] - 1, dateKey.split('-')[2]);
             displayAppointmentTimes(selectedDate, dateKey); // Listeyi tekrar çiz (simüle veriyle fark etmez)
        }
    }

    // ----- AKTİF RANDEVULAR -----
    function fetchAndDisplayActiveAppointments() {
        console.log("Aktif randevular yükleniyor (simülasyon)...");
        // Gerçekte: fetch('/api/my-appointments')
        const appointments = sampleActiveAppointments; // Örnek veriyi kullan
        displayActiveAppointments(appointments);
    }

    function displayActiveAppointments(appointments) {
        activeAppointmentsList.innerHTML = ''; // Temizle
        if (!appointments || appointments.length === 0) {
            noActiveAppointmentsMsg.style.display = 'block';
        } else {
            noActiveAppointmentsMsg.style.display = 'none';
            appointments.forEach(appt => {
                const item = document.createElement('div');
                item.classList.add('active-appointment-item');
                item.dataset.appointmentId = appt.id;

                item.innerHTML = `
                    <p><strong>Berber:</strong> ${appt.barberName || appt.barberId}</p>
                    <p><strong>Tarih:</strong> ${appt.date}</p>
                    <p><strong>Saat:</strong> ${appt.time}</p>
                    <button class="cancel-button" data-appointment-id="${appt.id}" title="Randevuyu İptal Et">&times;</button>
                `;
                activeAppointmentsList.appendChild(item);
            });
        }
    }

     function handleActiveAppointmentActions(event) {
         if (event.target.classList.contains('cancel-button')) {
             const appointmentId = event.target.dataset.appointmentId;
             cancelAppointment(appointmentId, event.target.closest('.active-appointment-item'));
         }
     }

    function cancelAppointment(appointmentId, itemElement) {
         const confirmation = confirm(`Randevuyu (ID: ${appointmentId}) iptal etmek istediğinizden emin misiniz?`);
         if (confirmation) {
             console.log(`Randevu iptal ediliyor (Simülasyon): ${appointmentId}`);
             // ---- Backend isteği burada yapılır (DELETE /api/appointments/{id}) ----
             alert('Randevu iptal edildi (simülasyon).');
             if (itemElement) {
                 itemElement.remove(); // Öğeyi listeden kaldır
             }
             // Eğer hiç kalmadıysa mesajı göster
             if (activeAppointmentsList.children.length === 0) {
                 noActiveAppointmentsMsg.style.display = 'block';
             }
             // İlgili günün müsaitliğini takvimde güncellemek gerekebilir (veri yenileme ile)
         }
    }

    // ----- Sayfa Yüklendiğinde Başlat -----
    initializePage();

}); // DOMContentLoaded sonu