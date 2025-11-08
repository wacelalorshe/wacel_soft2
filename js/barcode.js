// Barcode Scanner functionality
let barcodeScanner = null;

function openBarcodeScanner() {
    document.getElementById('barcodeScannerModal').style.display = 'flex';
    initializeBarcodeScanner();
}

function closeBarcodeScanner() {
    document.getElementById('barcodeScannerModal').style.display = 'none';
    stopBarcodeScanner();
}

function initializeBarcodeScanner() {
    const scannerElement = document.getElementById('barcodeScanner');
    scannerElement.innerHTML = '<div style="text-align: center; padding: 20px;">جاري تهيئة قارئ الباركود...</div>';
    
    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: scannerElement,
            constraints: {
                width: 400,
                height: 300,
                facingMode: "environment"
            }
        },
        decoder: {
            readers: ["code_128_reader", "ean_reader", "ean_8_reader", "code_39_reader"]
        }
    }, function(err) {
        if (err) {
            console.error(err);
            scannerElement.innerHTML = '<div style="text-align: center; padding: 20px; color: red;">خطأ في تهيئة قارئ الباركود. تأكد من صلاحية الكاميرا.</div>';
            return;
        }
        Quagga.start();
    });
    
    Quagga.onDetected(function(result) {
        const code = result.codeResult.code;
        document.getElementById('barcodeResult').innerHTML = `
            <div style="background: #d4edda; color: #155724; padding: 15px; border-radius: 8px; margin: 10px 0;">
                تم قراءة الباركود: <strong>${code}</strong>
            </div>
        `;
        
        // Find product by barcode
        const product = products.find(p => p.barcode === code);
        if (product) {
            addToCart(product);
            setTimeout(closeBarcodeScanner, 2000);
        } else {
            document.getElementById('barcodeResult').innerHTML += `
                <div style="background: #f8d7da; color: #721c24; padding: 15px; border-radius: 8px; margin: 10px 0;">
                    المنتج غير موجود في المخزون
                </div>
            `;
        }
    });
}

function stopBarcodeScanner() {
    if (Quagga) {
        Quagga.stop();
    }
}

// Generate barcode for products
function generateProductBarcode(productId, barcodeValue) {
    JsBarcode(`#barcode-${productId}`, barcodeValue, {
        format: "CODE128",
        lineColor: "#000",
        width: 2,
        height: 40,
        displayValue: true
    });
}
