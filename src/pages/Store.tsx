
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import medusa from "../lib/medusaClient"
import { motion } from "framer-motion"
import { Search, Filter, Grid, List, ShoppingCart } from "lucide-react"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { useCart } from "@/hooks/useCart"

const BASE_CATS = ["All"]

export default function Store() {
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [allProducts, setAllProducts] = useState<any[]>([])
  const [filtered, setFiltered] = useState<any[]>([])
  const [categories, setCategories] = useState<string[]>(BASE_CATS)
  const [selectedCat, setSelectedCat] = useState("All")
  const [search, setSearch] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const { products } = await medusa.products.list({ limit: 100 })
        console.log("🔎 medusa.products.list() →", { products })

        // Handle case where products might be undefined
        const productList = products || []
        setAllProducts(productList)
        setFiltered(productList)

        // Safely extract categories from products
        const cats = Array.from(
          new Set(
            productList.flatMap((p: any) =>
              (p.tags && Array.isArray(p.tags)) ? p.tags.map((t: any) => t.value || '') : []
            ).filter(Boolean)
          )
        )
        setCategories([...BASE_CATS, ...cats])
      } catch (err) {
        console.error("Failed to load products:", err)
        // Set empty arrays to prevent crashes
        setAllProducts([])
        setFiltered([])
        toast.error("Failed to load products. Please try again later.")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  useEffect(() => {
    let res = allProducts

    if (selectedCat !== "All") {
      res = res.filter((p) =>
        (p.tags && Array.isArray(p.tags)) && p.tags.some((t: any) => t.value === selectedCat)
      )
    }

    if (search) {
      const term = search.toLowerCase()
      res = res.filter(
        (p) =>
          (p.title && p.title.toLowerCase().includes(term)) ||
          (p.subtitle && p.subtitle.toLowerCase().includes(term))
      )
    }

    setFiltered(res)
  }, [search, selectedCat, allProducts])

  // Helper function to extract price from Medusa product variant
  const getProductPrice = (product: any) => {
    console.log("🔍 Extracting price for product:", product.title, product)
    
    if (!product.variants || !Array.isArray(product.variants) || product.variants.length === 0) {
      console.log("❌ No variants found")
      return 0
    }

    const variant = product.variants[0]
    console.log("🔍 First variant:", variant)

    if (!variant.prices || !Array.isArray(variant.prices)) {
      console.log("❌ No prices array found")
      return 0
    }

    // Handle different price structures
    let price = 0
    
    // Try different approaches to get the price
    if (variant.prices.length > 0) {
      const priceObj = variant.prices[0]
      console.log("🔍 First price object:", priceObj)
      
      // Check if it's a direct price object with amount
      if (priceObj && typeof priceObj.amount === 'number' && priceObj.amount !== null) {
        price = priceObj.amount
      }
      // Check if it's a nested structure with numbered keys
      else if (priceObj && typeof priceObj === 'object') {
        // Look for numbered keys (0, 1, 2, etc.)
        const keys = Object.keys(priceObj)
        for (const key of keys) {
          if (priceObj[key] && typeof priceObj[key].amount === 'number' && priceObj[key].amount !== null) {
            price = priceObj[key].amount
            break
          }
        }
      }
      
      // If still no price found, try to find any price-like field
      if (price === 0 && priceObj) {
        // Look for other possible price fields
        const possiblePriceFields = ['unit_price', 'calculated_price', 'original_price', 'price']
        for (const field of possiblePriceFields) {
          if (priceObj[field] && typeof priceObj[field] === 'number' && priceObj[field] !== null) {
            price = priceObj[field]
            console.log(`🔍 Found price in field ${field}:`, price)
            break
          }
        }
      }
    }

    console.log("💰 Final extracted price:", price)
    
    // If no price found, return a default price for demo purposes
    if (price === 0) {
      console.log("⚠️ No price found, returning default price")
      return 99900 // Default ₹999.00 in cents
    }
    
    return price
  }

  const handleAddToCart = async (product: any) => {
    try {
      // If product has multiple variants, redirect to product page
      if (product.variants && product.variants.length > 1) {
        navigate(`/product/${product.id}`)
        return
      }

      const variant = product.variants?.[0]
      if (!variant) {
        toast.error("Product variant not available")
        return
      }

      const price = getProductPrice(product)

      // Add to local cart for now (you can integrate with Medusa cart later)
      addToCart({
        filename: product.title || "Unknown Product",
        material: variant.title || "Default",
        infill: 20, // Default infill
        layerHeight: "0.2",
        price: Math.round(price / 100) // Convert from cents to rupees
      })

      toast.success("Added to cart!")
    } catch (err) {
      console.error("Failed to add to cart:", err)
      toast.error("Failed to add to cart")
    }
  }

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`)
  }

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20"
      >
        <Navbar />
        <div className="container mx-auto px-4 py-24">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <span className="ml-4 text-lg">Loading amazing products...</span>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20"
    >
      <Navbar />

      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent mb-6">
            3D Print Store
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our collection of ready-to-print designs and custom products. 
            High-quality 3D models for every need.
          </p>
        </motion.div>

        {/* Search and View Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex flex-col lg:flex-row gap-4 mb-8 items-center"
        >
          <div className="flex-1 relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search for amazing products..."
              className="pl-10 h-12 bg-card/50 border-primary/20 focus:border-primary"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className="h-12 w-12"
            >
              <Grid className="h-5 w-5" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
              className="h-12 w-12"
            >
              <List className="h-5 w-5" />
            </Button>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Enhanced Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="lg:w-80"
          >
            <Card className="glass-card border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Filter className="h-5 w-5" />
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <motion.button
                      key={cat}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedCat(cat)}
                      className={`block w-full text-left px-4 py-3 rounded-lg transition-all ${
                        selectedCat === cat
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {cat}
                    </motion.button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Product Grid */}
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1"
              }`}
            >
              {filtered.map((product, i) => {
                const imageUrl = product.images?.[0]?.url || ""
                const variant = product.variants?.[0]
                const price = getProductPrice(product)
                const hasMultipleVariants = product.variants && product.variants.length > 1

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.6 }}
                    whileHover={{ y: -5 }}
                  >
                    <Card className="group h-full overflow-hidden glass-card border-primary/20 hover:border-primary/40 transition-all duration-300">
                      <div 
                        className="relative h-48 bg-gradient-to-br from-muted/30 to-muted/60 cursor-pointer overflow-hidden"
                        onClick={() => handleProductClick(product.id)}
                      >
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={product.title || "Product"}
                            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-muted-foreground">
                            <div className="text-center">
                              <div className="w-16 h-16 mx-auto mb-2 bg-muted rounded-full flex items-center justify-center">
                                <ShoppingCart className="h-8 w-8" />
                              </div>
                              <p className="text-sm">No Image</p>
                            </div>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>

                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle 
                            className="cursor-pointer hover:text-primary transition-colors"
                            onClick={() => handleProductClick(product.id)}
                          >
                            {product.title || "Untitled Product"}
                          </CardTitle>
                          <div className="flex flex-col gap-1">
                            <Badge variant="secondary" className="bg-primary/10 text-primary">
                              {product.tags?.[0]?.value || "Product"}
                            </Badge>
                            {hasMultipleVariants && (
                              <Badge variant="outline" className="text-xs">
                                {product.variants.length} variants
                              </Badge>
                            )}
                          </div>
                        </div>
                        {product.subtitle && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {product.subtitle}
                          </p>
                        )}
                      </CardHeader>

                      <CardFooter className="flex justify-between items-center">
                        <div className="text-2xl font-bold text-primary">
                          ₹{(price / 100).toFixed(2)}
                        </div>
                        <Button 
                          onClick={() => handleAddToCart(product)}
                          className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground"
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          {hasMultipleVariants ? "View Options" : "Add to Cart"}
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                )
              })}
            </motion.div>

            {filtered.length === 0 && !loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
                  <Search className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </motion.div>
  )
}
