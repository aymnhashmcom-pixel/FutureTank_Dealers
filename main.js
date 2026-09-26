// رابط الـ Web App الخاص بـ FutureTank Dealers
const API_URL = "https://script.google.com/macros/s/AKfycbyfyJoV4CAFyvhphyksa2Eh8G33ArtdYmHWGsl5vlXHGxn5Eg6uqZIw3M3k5YKB6H_Vsg/exec";

// تحميل المنتجات فور فتح الصفحة
document.addEventListener("DOMContentLoaded", () => {
    fetchProducts("All");
});

// دالة تغيير المحافظة
function onGovernorateChange() {
    const selectedGov = document.getElementById("gov-select").value;
    fetchProducts(selectedGov);
}

// جلب البيانات من Google Apps Script
async function fetchProducts(governorate) {
    const container = document.getElementById("products-container");
    const loading = document.getElementById("loading");

    loading.style.display = "block";
    container.innerHTML = "";

    try {
        const response = await fetch(`${API_URL}?gov=${encodeURIComponent(governorate)}`);
        const products = await response.json();

        loading.style.display = "none";

        if (!products || products.length === 0) {
            container.innerHTML = "<p style='grid-column: 1/-1; text-align: center;'>لا توجد منتجات معروضة حالياً في هذه المحافظة.</p>";
            return;
        }

        products.forEach(item => {
            const card = document.createElement("div");
            card.className = "product-card";

            const waText = `أهلاً ${item.dealerName}، أنا مهتم بمنتج (${item.productName}) المعروض على منصة FutureTank Dealers`;
            const waLink = `https://wa.me/2${item.dealerPhone}?text=${encodeURIComponent(waText)}`;

            card.innerHTML = `
                <img src="${item.imageUrl || 'https://via.placeholder.com/300x200?text=FutureTank'}" alt="${item.productName}" class="product-img" />
                <div class="product-info">
                    <h3 class="product-title">${item.productName}</h3>
                    <p class="product-desc">${item.description}</p>
                    <span class="dealer-tag">التاجر: ${item.dealerName}</span>
                    <a href="${waLink}" target="_blank" class="btn-whatsapp">
                        تواصل عبر الواتساب 💬
                    </a>
                </div>
            `;

            container.appendChild(card);
        });

    } catch (error) {
        console.error("خطأ في جلب البيانات:", error);
        loading.style.display = "none";
        container.innerHTML = "<p style='grid-column: 1/-1; text-align: center; color: red;'>حدث خطأ أثناء تحميل المنتجات. يرجى المحاولة لاحقاً.</p>";
    }
}
