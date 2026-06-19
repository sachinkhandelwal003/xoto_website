import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import { apiService } from '../../manageApi/utils/custom.apiservice'; // path adjust kar lena

const Category = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiService.get(
          "/products/get-all-category",
          { limit: 100 }
        );

        let apiCategories = response?.data || [];

        apiCategories.sort((a, b) => {
          const nameA = (a.name || "").toLowerCase();
          const nameB = (b.name || "").toLowerCase();
          if (nameA < nameB) return -1;
          if (nameA > nameB) return 1;
          return 0;
        });

        const formatted = apiCategories.map((cat, index) => {
          const name = cat.name || "Category";

          const imageUrl = cat.icon
            ? cat.icon
            : `https://via.placeholder.com/64?text=${name}`;

          return {
            id: cat._id || index + 1,
            name: name,
            icon: (
              <img
                src={imageUrl}
                alt={name}
                loading="lazy"
                // 👇 Yahan se brightness-0 aur invert hata diya hai
                className="w-full h-full object-contain p-1" 
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/64?text=Error";
                }}
              />
            ),
            color: getOriginalColor(index),
            isNew: false,
            isDeal: false,
          };
        });

        formatted.push({
          id: 999,
          name: "See More",
          icon: <FaPlus />,
          color: "from-gray-700 to-gray-500",
        });

        setCategories(formatted);
      } catch (err) {
        console.error("❌ Fetch failed:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

 const getOriginalColor = (index) => {
  const colors = [
    "from-[#5c039b] to-[#5c039b]",
    "from-[#5c039b] to-[#5c039b]",
    "from-[#5c039b] to-[#5c039b]",
    "from-[#5c039b] to-[#5c039b]",
    "from-[#5c039b] to-[#5c039b]",
    "from-[#5c039b] to-[#5c039b]",
    "from-[#5c039b] to-[#5c039b]",
    "from-[#5c039b] to-[#5c039b]",
    "from-[#5c039b] to-[#5c039b]",
    "from-[#5c039b] to-[#5c039b]",
    "from-[#5c039b] to-[#5c039b]",
    "from-[#5c039b] to-[#5c039b]",
    "from-[#5c039b] to-[#5c039b]",
  ];
  return colors[index % colors.length];
};

  const handleCategoryClick = (categoryName) => {
    const slug = categoryName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/&/g, "and");

    navigate(`/ecommerce/filter?category=${slug}`);
  };

  if (loading) {
    return (
      <div className='bg-[var(--color-body)]'>
        <div className="max-w-7xl mx-auto px-4 py-16 bg-[var(--color-body)]">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Shop by <span className="text-[var(--color-primary)]">Category</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Loading categories...
            </p>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {Array(8).fill(0).map((_, i) => (
              <div
                key={i}
                className="w-full aspect-square max-w-[120px] mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-[var(--color-body)]'>
      <div className="max-w-7xl mx-auto px-4 py-16 bg-[var(--color-body)]">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Shop by <span className="text-[var(--color-primary)]">Category</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse through our carefully curated furniture categories
          </p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => handleCategoryClick(category.name)}
              whileHover={{ y: -4, scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="group"
            >
              <div className="flex flex-col items-center justify-center p-3 border border-gray-100 rounded-2xl bg-white shadow-sm hover:shadow-lg hover:border-[#5c039b]/30 transition-all duration-300 w-full aspect-square max-w-[120px] mx-auto">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[#5c039b] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300 overflow-hidden flex-shrink-0">
                  <div className="text-white text-xl w-full h-full flex items-center justify-center p-1">
                    {category.icon}
                  </div>
                </div>
                <span className="text-[11px] sm:text-xs font-semibold text-gray-700 group-hover:text-[#5c039b] transition-colors text-center leading-tight line-clamp-2 w-full">
                  {category.name}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Category;