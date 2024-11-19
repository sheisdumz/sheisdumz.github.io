document.addEventListener('DOMContentLoaded', () => {
    const sortBy = document.getElementById('sort-by');
    const order = document.getElementById('order');
    const lessonsContainer = document.querySelector('.lessons');

    sortBy.addEventListener('change', sortLessons);
    order.addEventListener('change', sortLessons);

    function sortLessons() {
        // Logic to sort lessons based on selected criteria
        console.log(`Sorting by ${sortBy.value} in ${order.value} order`);
    }
});