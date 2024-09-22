import { Link } from 'react-router-dom';

const CustomLink = ({ to, children, ...props }) => {
    
  const modifiedTo = to.replace(/\s+/g, '-');
  
  return (
    <Link to={modifiedTo} {...props} target='-blank'>
      {children}
    </Link>
  );
};

export default CustomLink;