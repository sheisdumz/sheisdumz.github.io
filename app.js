let app = new Vue({
    el: "#app",
    data: {
      lessons: [], // List of lessons fetched from API
      cart: [], // Items added to the cart
      showCart: false, // Toggle between lessons view and cart view
      sortAttribute: "subject", // Sorting criteria
      sortOrder: "asc", // Sorting order
      searchQuery: "", // Search query input
      checkout: {
        name: "",
        phone: "",
      },
      loading: true, // Loading indicator for fetching lessons
    },
    computed: {
      // Enable checkout button only if name and phone are valid
      isCheckoutEnabled() {
        const nameValid = /^[a-zA-Z\s]+$/.test(this.checkout.name);
        const phoneValid = /^[0-9]+$/.test(this.checkout.phone);
        return nameValid && phoneValid;
      },
    },
    methods: {
      filteredLessons() {
        this.fetchProducts(); // Ensure this is called whenever searchQuery changes
        return this.lessons;
      },
  
      // Fetch lessons from the API
      fetchProducts: async function () {
        try {
          // Build the query URL with search parameters
          const response = await fetch(
            `https://express-js-qwj4.onrender.com/collections/courses/search?search=${this.searchQuery}&sortKey=${this.sortAttribute}&sortOrder=${this.sortOrder}`
          );
  
          // Parse and update the lessons array
          if (response.ok) {
            const data = await response.json();
            this.lessons = data;
            this.sortLessons(); // Sort the lessons based on the selected criteria
            console.log("Fetched lessons:", this.lessons);
          } else {
            console.error("Failed to fetch products:", await response.text());
          }
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      },
  
      // Sort the lessons based on selected attribute and order
      sortLessons() {
        const sortOrder = this.sortOrder === "asc" ? 1 : -1; // Ascending or descending order
        this.lessons.sort((a, b) => {
          // Compare based on the selected sort key (e.g., subject, location, price, etc.)
          if (a[this.sortAttribute] < b[this.sortAttribute]) {
            return -sortOrder;
          }
          if (a[this.sortAttribute] > b[this.sortAttribute]) {
            return sortOrder;
          }
          return 0;
        });
      },
  
      // Add a lesson to the cart
      addToCart(lesson) {
        const existingLesson = this.cart.find(item => item.id === lesson.id);
        if (existingLesson) {
          // Increment the count if lesson is already in the cart
          existingLesson.count += 1;
        } else {
          // Add a new object with all lesson details and count = 1
          this.cart.push({
            id: lesson.id,
            subject: lesson.subject,
            location: lesson.location,
            price: lesson.price,
            image: lesson.image,
            count: 1,
          });
        }
        lesson.spaces--; // Decrement available spaces
      },
  
      // Remove a lesson from the cart
      removeFromCart(lesson) {
        const existingLesson = this.cart.find(item => item.id === lesson.id);
        if (existingLesson) {
          existingLesson.count -= 1; // Decrease the count
          if (existingLesson.count === 0) {
            // Remove from cart if count is 0
            this.cart = this.cart.filter(item => item.id !== lesson.id);
          }
          lesson.spaces++; // Increment available spaces
        }
      },
  
      // Toggle between cart and lessons page
      toggleCartPage() {
        this.showCart = !this.showCart;
      },
    },
    mounted() {
      // Fetch lessons when the app is mounted
      this.fetchProducts();
    },
  });
  