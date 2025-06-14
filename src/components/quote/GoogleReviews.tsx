
import { motion } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, RefreshCw, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useGoogleReviews } from '@/hooks/useGoogleReviews';

export default function GoogleReviews() {
  const { reviews, loading, error, averageRating, totalReviews, refreshReviews } = useGoogleReviews();
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const displayedReviews = reviews.slice(currentIndex, currentIndex + 3);

  return (
    <section className="py-16 bg-white/50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <img 
              src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCA3NCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KPHBhdGggZD0iTTkuNDggMTguMTFjLS45NSAwLTEuNzUtLjM0LTIuNC0xLjAyLS42NS0uNjgtLjk3LTEuNTEtLjk3LTIuNDkgMC0uOTguMzItMS44MS45Ny0yLjQ5LjY1LS42OCAxLjQ1LTEuMDIgMi40LTEuMDIuOTUgMCAxLjc1LjM0IDIuNDEgMS4wMi42NS42OCAxIC41MS45NyAyLjQ5IDAgLjk4LS4zMiAxLjgxLS45NyAyLjQ5LS42Ni42OC0xLjQ2IDEuMDItMi40MSAxLjAyem0wLTEuNjdjLjQxIDAgLjc1LS4xNSAxLjAyLS40NC4yNy0uMjkuNDEtLjY3LjQxLTEuMTQgMC0uNDctLjE0LS44NS0uNDEtMS4xNC0uMjctLjI5LS42MS0uNDQtMS4wMi0uNDQtLjQxIDAtLjc1LjE1LTEuMDIuNDQtLjI3LjI5LS40MS42Ny0uNDEgMS4xNCAwIC40Ny4xNC44NS40MSAxLjE0LjI3LjI5LjYxLjQ0IDEuMDIuNDR6TTEzLjU0IDE4LjExYy0uOTUgMC0xLjc1LS4zNC0yLjQtMS4wMi0uNjUtLjY4LS45Ny0xLjUxLS45Ny0yLjQ5IDAtLjk4LjMyLTEuODEuOTctMi40OS42NS0uNjggMS40NS0xLjAyIDIuNC0xLjAyLjk1IDAgMS43NS4zNCAyLjQxIDEuMDIuNjUuNjguOTcgMS41MS45NyAyLjQ5IDAgLjk4LS4zMiAxLjgxLS45NyAyLjQ5LS42Ni42OC0xLjQ2IDEuMDItMi40MSAxLjAyem0wLTEuNjdjLjQxIDAgLjc1LS4xNSAxLjAyLS40NC4yNy0uMjkuNDEtLjY3LjQxLTEuMTQgMC0uNDctLjE0LS44NS0uNDEtMS4xNC0uMjctLjI5LS42MS0uNDQtMS4wMi0uNDQtLjQxIDAtLjc1LjE1LTEuMDIuNDQtLjI3LjI5LS40MS42Ny0uNDEgMS4xNCAwIC40Ny4xNC44NS40MSAxLjE0LjI3LjI5LjYxLjQ0IDEuMDIuNDR6TTIxLjk5IDE4LjE5Yy0uODkgMC0xLjY0LS4zLTIuMjUtLjktLjYxLS42LS45MS0xLjM2LS45MS0yLjI5IDAtLjkzLjMtMS42OS45MS0yLjI5LjYxLS42IDEuMzYtLjkgMi4yNS0uOSAuNjMgMCAxLjE5LjEzIDEuNjguMzkuNDkuMjYuODcuNjEgMS4xNCAxLjA1bC0xLjM1LjkxYy0uMTgtLjI5LS40MS0uNTItLjY5LS42OS0uMjgtLjE3LS41OC0uMjYtLjktLjI2LS40NyAwLS44Ni4xNS0xLjE3LjQ0LS4zMS4yOS0uNDcuNjctLjQ3IDEuMTQgMCAuNDcuMTYuODUuNDcgMS4xNC4zMS4yOS43LjQ0IDEuMTcuNDQuMzIgMCAuNjItLjA5LjktLjI2LjI4LS4xNy41MS0uNDAuNjktLjY5bDEuMzUuOTFjLS4yNy40NC0uNjUuNzktMS4xNCAxLjA1LS40OS4yNi0xLjA1LjM5LTEuNjguMzl6Ii8+CjxyZWN0IHdpZHRoPSI3NCIgaGVpZ2h0PSIyNCIgcng9IjMiIGZpbGw9IiNGRkYiLz4KPHA+Cjx0ZXh0IGZpbGw9IiM0Mjg1RjQiIGZvbnQtZmFtaWx5PSJHb29nbGVTYW5zLVJlZ3VsYXIsIEdvb2dsZSBTYW5zIiBmb250LXNpemU9IjEyIiBmb250LXdlaWdodD0ibm9ybWFsIj4KPHRzcGFuIHg9IjE0IiB5PSIxNSI+R29vZ2xlPC90c3Bhbj4KPC90ZXh0Pgo8L3A+CjwvZz4KPC9zdmc+" 
              alt="Google" 
              className="h-6"
            />
            <span className="text-sm text-muted-foreground">- Backed Trust in Every Order</span>
          </div>
          
          <h2 className="text-3xl font-bold mb-2">Customer Reviews</h2>
          
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-6 h-6 ${i < Math.round(averageRating) ? 'fill-current' : ''}`} 
                />
              ))}
            </div>
            <span className="text-2xl font-bold">
              {averageRating.toFixed(1)} EXCELLENT
            </span>
          </div>
          
          <div className="flex items-center justify-center gap-4 mb-4">
            <p className="text-sm text-muted-foreground">
              Based on {totalReviews}+ reviews
            </p>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={refreshReviews}
              disabled={loading}
              className="text-xs"
            >
              <RefreshCw className={`w-3 h-3 mr-1 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {error && (
            <div className="flex items-center justify-center gap-2 text-amber-600 mb-4">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              size="icon"
              onClick={prevReview}
              className="rounded-full"
              disabled={loading}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={nextReview}
              className="rounded-full"
              disabled={loading}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, index) => (
                <Card key={index} className="h-full animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gray-300 rounded-full" />
                      <div className="flex-1">
                        <div className="h-4 bg-gray-300 rounded mb-2" />
                        <div className="h-3 bg-gray-200 rounded w-2/3" />
                      </div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded mb-3" />
                    <div className="h-12 bg-gray-100 rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {displayedReviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        {review.profilePhoto ? (
                          <img 
                            src={review.profilePhoto} 
                            alt={review.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold">
                            {review.name.charAt(0)}
                          </div>
                        )}
                        <div className="flex-1">
                          <h4 className="font-semibold">{review.name}</h4>
                          <p className="text-sm text-muted-foreground">{review.date}</p>
                        </div>
                        {review.verified && (
                          <img 
                            src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMTAiIGZpbGw9IiM0Mjg1RjQiLz4KPHBhdGggZD0iTTggMTJsLTItMiAxLjQxLTEuNDFMOCA5LjE3bDIuNTktMi41OEwxMiA4bC00IDR6IiBmaWxsPSIjRkZGIi8+Cjwvc3ZnPg==" 
                            alt="Google verified"
                            className="w-5 h-5"
                          />
                        )}
                      </div>
                      
                      <div className="flex text-yellow-400 mb-3">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      
                      <p className="text-sm text-muted-foreground">{review.review}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
