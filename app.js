let app = new Vue({
    el: "#app",
    data: {
      lessons: [], // List of lessons fetched from API
      cart: [], // Items added to the cart
      showCart: false, // Toggle between lessons view and cart view
      sortAttribute: "subject", // Sorting criteria
      sortKey: "title",
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
      // Fetch lessons from the API
      async fetchProducts() {
        try {
          const response = await fetch(
            `https://express-js-qwj4.onrender.com/collections/courses/search?search=${this.searchQuery}&sortKey=${this.sortKey}&sortOrder=${this.sortOrder}`
          );
  
          if (response.ok) {
            this.lessons = await response.json();
            console.log("Fetched lessons:", this.lessons);
          } else {
            console.error("Failed to fetch lessons:", await response.text());
          }
        } catch (error) {
          console.error("Error fetching lessons:", error);
        }
      },
  
      // Add a lesson to the cart
      addToCart(lesson) {
        const existingLesson = this.cart.find(item => item.id === lesson.id);
        if (existingLesson) {
          existingLesson.count += 1; // Increment count
        } else {
          this.cart.push({
            ...lesson, // Copy lesson properties
            count: 1, // Add count
          });
        }
        lesson.spaces--; // Decrement available spaces
      },
  
      // Remove a lesson from the cart
      removeFromCart(lesson) {
        const existingLesson = this.cart.find(item => item.id === lesson.id);
        if (existingLesson) {
          existingLesson.count -= 1; // Decrement count
          if (existingLesson.count <= 0) {
            // Remove lesson if count is 0
            this.cart = this.cart.filter(item => item.id !== lesson.id);
          }
        }
        lesson.spaces++; // Increment available spaces
      },
  
      // Toggle between cart and lessons page
      toggleCartPage() {
        this.showCart = !this.showCart;
      },
  
      // Handle checkout
      async checkoutForm() {
        if (this.isCheckoutEnabled) {
          alert(`Order submitted with ${this.cart.length} items. Thank you!`);
  
          const orderData = {
            name: this.checkout.name,
            phone: this.checkout.phone,
            courses: this.cart.reduce((acc, lesson) => {
              const existingLesson = acc.find(item => item.id === lesson.id);
              if (existingLesson) {
                existingLesson.count += lesson.count;
              } else {
                acc.push({
                  id: lesson.id,
                  count: lesson.count,
                });
              }
              return acc;
            }, []), // Initialize accumulator as an empty array
          };
  
          console.log("Order Data:", orderData);
  
          try {
            const response = await fetch(
              "https://express-js-qwj4.onrender.com/collections/Orders",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(orderData),
              }
            );
  
            if (response.ok) {
              alert("Order submitted successfully!");
              // Reset form and cart
              this.checkout = { name: "", phone: "" };
              this.cart = [];
              this.showCart = false;
            } else {
              console.error("Failed to submit order:", await response.text());
            }
          } catch (error) {
            console.error("Error submitting order:", error);
          }
        }
      },
    },
    mounted() {
      this.fetchProducts(); // Fetch lessons when the app is mounted
    },
  });
  