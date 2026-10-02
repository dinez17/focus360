import { Link } from 'react-router-dom';

const Button = ({ to, href, children, variant = 'primary', className = '', ...props }) => {
    const styles = {
        primary: 'bg-primary-500 text-white hover:bg-primary-600 shadow-md',
        secondary: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-50',
    };


    const classes = `inline-block px-6 py-3 rounded-xl font-medium transition-colors ${styles[variant]} ${className}`;

    if (to) return <Link to={to} className={classes} {...props}>{children}</Link>;
    if (href) return <a href={href} className={classes} {...props}>{children}</a>;
    return <button className={classes} {...props}>{children}</button>;
};

export default Button;