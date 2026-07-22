import * as React from "react"
import { cn } from "@/lib/utils"

const FALLBACK_IMAGE_URL = "/images/placeholder-product.svg"

/**
 * مكوّن صورة بسيط يعتمد على الرابط كما هو (رفعناه لاحقًا إلى Supabase Storage
 * أو أي رابط خارجي)، مع صورة بديلة محلية عند فشل التحميل — بدون أي منطق
 * تحويل خاص بمنصات خارجية.
 */
const Image = React.forwardRef(
  ({ src, fittingType = "fill", className, style, ...props }, ref) => {
    const [imgSrc, setImgSrc] = React.useState(src)

    React.useEffect(() => {
      setImgSrc(src)
    }, [src])

    return (
      <img
        ref={ref}
        src={imgSrc || FALLBACK_IMAGE_URL}
        loading="lazy"
        onError={() => setImgSrc(FALLBACK_IMAGE_URL)}
        className={cn(
          fittingType === "fit" ? "object-contain" : "object-cover",
          className
        )}
        style={style}
        {...props}
      />
    )
  }
)
Image.displayName = "Image"

export { Image }
