-- Database functions for order management system
-- Created: 2025-08-01
-- Description: Functions for dashboard metrics, search, and complex queries

-- Function to calculate order totals (triggers automatic total calculation)
CREATE OR REPLACE FUNCTION public.calculate_order_total(order_id_param UUID)
RETURNS DECIMAL(10,2) AS $$
DECLARE
    total_amount DECIMAL(10,2);
BEGIN
    SELECT COALESCE(SUM(subtotal), 0)
    INTO total_amount
    FROM public.order_items
    WHERE order_id = order_id_param;
    
    UPDATE public.orders
    SET total_amount = total_amount
    WHERE id = order_id_param;
    
    RETURN total_amount;
END;
$$ LANGUAGE plpgsql;

-- Function to get dashboard metrics
CREATE OR REPLACE FUNCTION public.get_dashboard_metrics()
RETURNS JSON AS $$
DECLARE
    result JSON;
    pending_count INTEGER;
    processing_count INTEGER;
    completed_count INTEGER;
    cancelled_count INTEGER;
    current_month_revenue DECIMAL(10,2);
    current_week_revenue DECIMAL(10,2);
    completion_rate DECIMAL(5,2);
BEGIN
    -- Count orders by status
    SELECT COUNT(*) INTO pending_count FROM public.orders WHERE status = 'pending';
    SELECT COUNT(*) INTO processing_count FROM public.orders WHERE status = 'processing';
    SELECT COUNT(*) INTO completed_count FROM public.orders WHERE status = 'completed';
    SELECT COUNT(*) INTO cancelled_count FROM public.orders WHERE status = 'cancelled';
    
    -- Calculate current month revenue
    SELECT COALESCE(SUM(total_amount), 0)
    INTO current_month_revenue
    FROM public.orders
    WHERE status = 'completed'
    AND DATE_TRUNC('month', order_date) = DATE_TRUNC('month', CURRENT_DATE);
    
    -- Calculate current week revenue
    SELECT COALESCE(SUM(total_amount), 0)
    INTO current_week_revenue
    FROM public.orders
    WHERE status = 'completed'
    AND DATE_TRUNC('week', order_date) = DATE_TRUNC('week', CURRENT_DATE);
    
    -- Calculate completion rate
    SELECT CASE 
        WHEN (completed_count + cancelled_count) = 0 THEN 0
        ELSE ROUND((completed_count::DECIMAL / (completed_count + cancelled_count)) * 100, 2)
    END INTO completion_rate;
    
    -- Build JSON result
    result := json_build_object(
        'pending_orders', pending_count,
        'processing_orders', processing_count,
        'completed_orders', completed_count,
        'cancelled_orders', cancelled_count,
        'current_month_revenue', current_month_revenue,
        'current_week_revenue', current_week_revenue,
        'completion_rate', completion_rate,
        'total_orders', pending_count + processing_count + completed_count + cancelled_count
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to search orders with filters
CREATE OR REPLACE FUNCTION public.search_orders(
    search_term TEXT DEFAULT NULL,
    status_filter TEXT DEFAULT NULL,
    customer_id_filter UUID DEFAULT NULL,
    date_from TIMESTAMP DEFAULT NULL,
    date_to TIMESTAMP DEFAULT NULL,
    page_num INTEGER DEFAULT 1,
    page_size INTEGER DEFAULT 20
)
RETURNS TABLE(
    id UUID,
    customer_id UUID,
    status TEXT,
    total_amount DECIMAL(10,2),
    order_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    customer_name TEXT,
    customer_email TEXT,
    items_count BIGINT,
    total_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    WITH filtered_orders AS (
        SELECT 
            o.id,
            o.customer_id,
            o.status,
            o.total_amount,
            o.order_date,
            o.created_at,
            o.updated_at,
            c.name as customer_name,
            c.email as customer_email,
            COUNT(oi.id) as items_count
        FROM public.orders o
        LEFT JOIN public.customers c ON o.customer_id = c.id
        LEFT JOIN public.order_items oi ON o.id = oi.order_id
        WHERE 
            (search_term IS NULL OR 
             c.name ILIKE '%' || search_term || '%' OR 
             c.email ILIKE '%' || search_term || '%' OR
             o.id::TEXT ILIKE '%' || search_term || '%')
        AND (status_filter IS NULL OR o.status = status_filter)
        AND (customer_id_filter IS NULL OR o.customer_id = customer_id_filter)
        AND (date_from IS NULL OR o.order_date >= date_from)
        AND (date_to IS NULL OR o.order_date <= date_to)
        GROUP BY o.id, o.customer_id, o.status, o.total_amount, o.order_date, o.created_at, o.updated_at, c.name, c.email
        ORDER BY o.created_at DESC
    ),
    total_count_query AS (
        SELECT COUNT(*) as total FROM filtered_orders
    )
    SELECT 
        fo.*,
        tc.total as total_count
    FROM filtered_orders fo
    CROSS JOIN total_count_query tc
    LIMIT page_size
    OFFSET (page_num - 1) * page_size;
END;
$$ LANGUAGE plpgsql;

-- Function to get order with full details
CREATE OR REPLACE FUNCTION public.get_order_details(order_id_param UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'id', o.id,
        'customer_id', o.customer_id,
        'status', o.status,
        'total_amount', o.total_amount,
        'order_date', o.order_date,
        'created_at', o.created_at,
        'updated_at', o.updated_at,
        'customer', json_build_object(
            'id', c.id,
            'name', c.name,
            'email', c.email,
            'phone', c.phone,
            'address', c.address
        ),
        'order_items', COALESCE(
            (SELECT json_agg(
                json_build_object(
                    'id', oi.id,
                    'product_id', oi.product_id,
                    'quantity', oi.quantity,
                    'unit_price', oi.unit_price,
                    'subtotal', oi.subtotal,
                    'product', json_build_object(
                        'id', p.id,
                        'name', p.name,
                        'description', p.description,
                        'price', p.price
                    )
                )
            )
            FROM public.order_items oi
            LEFT JOIN public.products p ON oi.product_id = p.id
            WHERE oi.order_id = o.id
            ), '[]'::json
        )
    )
    INTO result
    FROM public.orders o
    LEFT JOIN public.customers c ON o.customer_id = c.id
    WHERE o.id = order_id_param;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to search customers
CREATE OR REPLACE FUNCTION public.search_customers(
    search_term TEXT DEFAULT NULL,
    page_num INTEGER DEFAULT 1,
    page_size INTEGER DEFAULT 20
)
RETURNS TABLE(
    id UUID,
    name TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    orders_count BIGINT,
    total_spent DECIMAL(10,2),
    total_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    WITH filtered_customers AS (
        SELECT 
            c.id,
            c.name,
            c.email,
            c.phone,
            c.address,
            c.created_at,
            c.updated_at,
            COUNT(o.id) as orders_count,
            COALESCE(SUM(CASE WHEN o.status = 'completed' THEN o.total_amount ELSE 0 END), 0) as total_spent
        FROM public.customers c
        LEFT JOIN public.orders o ON c.id = o.customer_id
        WHERE 
            (search_term IS NULL OR 
             c.name ILIKE '%' || search_term || '%' OR 
             c.email ILIKE '%' || search_term || '%' OR
             c.phone ILIKE '%' || search_term || '%')
        GROUP BY c.id, c.name, c.email, c.phone, c.address, c.created_at, c.updated_at
        ORDER BY c.name
    ),
    total_count_query AS (
        SELECT COUNT(*) as total FROM filtered_customers
    )
    SELECT 
        fc.*,
        tc.total as total_count
    FROM filtered_customers fc
    CROSS JOIN total_count_query tc
    LIMIT page_size
    OFFSET (page_num - 1) * page_size;
END;
$$ LANGUAGE plpgsql;

-- Function to search products
CREATE OR REPLACE FUNCTION public.search_products(
    search_term TEXT DEFAULT NULL,
    low_stock_only BOOLEAN DEFAULT FALSE,
    low_stock_threshold INTEGER DEFAULT 10,
    page_num INTEGER DEFAULT 1,
    page_size INTEGER DEFAULT 20
)
RETURNS TABLE(
    id UUID,
    name TEXT,
    description TEXT,
    price DECIMAL(10,2),
    stock_quantity INTEGER,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    times_ordered BIGINT,
    total_revenue DECIMAL(10,2),
    total_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    WITH filtered_products AS (
        SELECT 
            p.id,
            p.name,
            p.description,
            p.price,
            p.stock_quantity,
            p.created_at,
            p.updated_at,
            COUNT(oi.id) as times_ordered,
            COALESCE(SUM(oi.subtotal), 0) as total_revenue
        FROM public.products p
        LEFT JOIN public.order_items oi ON p.id = oi.product_id
        LEFT JOIN public.orders o ON oi.order_id = o.id AND o.status = 'completed'
        WHERE 
            (search_term IS NULL OR 
             p.name ILIKE '%' || search_term || '%' OR 
             p.description ILIKE '%' || search_term || '%')
        AND (NOT low_stock_only OR p.stock_quantity <= low_stock_threshold)
        GROUP BY p.id, p.name, p.description, p.price, p.stock_quantity, p.created_at, p.updated_at
        ORDER BY p.name
    ),
    total_count_query AS (
        SELECT COUNT(*) as total FROM filtered_products
    )
    SELECT 
        fp.*,
        tc.total as total_count
    FROM filtered_products fp
    CROSS JOIN total_count_query tc
    LIMIT page_size
    OFFSET (page_num - 1) * page_size;
END;
$$ LANGUAGE plpgsql;

-- Function to update product stock after order
CREATE OR REPLACE FUNCTION public.update_product_stock()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Decrease stock when order item is added
        UPDATE public.products
        SET stock_quantity = stock_quantity - NEW.quantity
        WHERE id = NEW.product_id;
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        -- Adjust stock based on quantity change
        UPDATE public.products
        SET stock_quantity = stock_quantity + OLD.quantity - NEW.quantity
        WHERE id = NEW.product_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        -- Increase stock when order item is removed
        UPDATE public.products
        SET stock_quantity = stock_quantity + OLD.quantity
        WHERE id = OLD.product_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update product stock
CREATE TRIGGER trigger_update_product_stock
    AFTER INSERT OR UPDATE OR DELETE ON public.order_items
    FOR EACH ROW
    EXECUTE FUNCTION public.update_product_stock();

-- Function to recalculate order total when items change
CREATE OR REPLACE FUNCTION public.recalculate_order_total()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        PERFORM public.calculate_order_total(NEW.order_id);
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        PERFORM public.calculate_order_total(OLD.order_id);
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to recalculate order totals
CREATE TRIGGER trigger_recalculate_order_total
    AFTER INSERT OR UPDATE OR DELETE ON public.order_items
    FOR EACH ROW
    EXECUTE FUNCTION public.recalculate_order_total();