let ctrMonth = 0; // ctrl month 
let clicked = null;
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];

const calendar = document.getElementById('calendar');
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const newEventModal = document.getElementById('newEventModal');
const deleteEventModal = document.getElementById('deleteEventModal');
const backDrop = document.getElementById('modalBackDrop')
const eventTitleInput = document.getElementById('eventTitleInput')

function openModal(date) { 
    clicked = date;

    const eventForDay = events.find(e => e.date === clicked);

    if(eventForDay) {
        document.getElementById('eventText').innerText = eventForDay.title;
        deleteEventModal.style.display = 'block';
        // console.log('there's an event!');
    } else {
        newEventModal.style.display = 'block';
        backDrop.style.display = 'block';
    }
}

function calLoad() {
    const dt = new Date();
    if (ctrMonth !== 0) {
        dt.setMonth(new Date().getMonth() + ctrMonth)
    } else {
        dt.setMonth(new Date().getMonth())
    }
    const m = dt.getMonth();
    const y = dt.getFullYear();

    const firstDay = new Date(y, m, 1);
    const lastDay = new Date(y, m + 1, 0).getDate();

    const dateStr = firstDay.toLocaleDateString('en-us', {
        weekday: 'long',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    });

    //날짜 앞에 빈공간
    const blankDays = weekdays.indexOf(dateStr.split(', ')[0]);

    //console.log(blankDays); //비는 공간이 얼만큼인지 확인
    document.getElementById('showMonth').innerText = `${dt.toLocaleDateString('en-us', { month: 'long' })} ${y}`;

    calendar.innerHTML = '';


    for (let i = 1; i <= blankDays + lastDay; i++) {
        const dayblock = document.createElement('div');
        dayblock.classList.add('day');
        const dayString = `${m+1}/${i-blankDays}/${y}`;

        if (i > blankDays) {
            dayblock.innerText = i - blankDays;
            const eventForDay = events.find(e=> e.date === dayString);
            dayblock.addEventListener('click', () => openModal(dayString));
            
            if(eventForDay) {
                const eventDiv = document.createElement('div');
                eventDiv.classList.add('event');
                eventDiv.innerText = eventForDay.title;
                dayblock.appendChild(eventDiv);
            }
        } else {
            dayblock.classList.remove('day');
            dayblock.classList.add('blank');
        }
        const today = new Date();
        if (i == today.getDate() + blankDays && m == today.getMonth() && y == today.getFullYear()) {
            dayblock.classList.add('today');
        }
        calendar.appendChild(dayblock);
    }
}
calLoad();

function closeModal() {
    eventTitleInput.classList.remove('error');
    newEventModal.style.display = 'none';
    deleteEventModal.style.display = 'none';
    backDrop.style.display = 'none';
    eventTitleInput.nodeValue='';
    clicked =null;
    calLoad();
}

function saveEvent() {
    if(eventTitleInput.value) {
        eventTitleInput.classList.remove('error');

        events.push({
            date:clicked,
            title:eventTitleInput.value,
        });
        localStorage.setItem('events', JSON.stringify(events));
    } else {
        eventTitleInput.classList.add('error');
    }   
}
function deleteEvent() {
    events = events.filter(e => e.date !== clicked);
    localStorage.setItem('events', JSON.stringify(events));
    closeModal();
}
function changeMonth() {
    document.getElementById('next').addEventListener('click', () => {
        ctrMonth++; //increase this and it'll add a month 
        calLoad(); //call next month calendar
    });

    document.getElementById('prev').addEventListener('click', () => {
        ctrMonth--; //decrease 
        calLoad(); //call next month calendar
    });

    document.getElementById('saveBtn').addEventListener('click', saveEvent);
    document.getElementById('cancelBtn').addEventListener('click', closeModal);
    document.getElementById('deleteBtn').addEventListener('click', deleteEvent);
    document.getElementById('closeBtn').addEventListener('click', closeModal);
}
changeMonth();