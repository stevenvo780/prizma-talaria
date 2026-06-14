import  React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import styles from './styles';

const ButtonStandard = ({ children, onPress, style }) => {
    const [isHover, setIsHover] = useState(false);

    const handlePressIn = () => {
        setIsHover(true);
    };

    const handlePressOut = () => {
        setIsHover(false);
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={[styles.ButtonStandard, isHover && styles.ButtonStandardHover, style]}
        >
            {children}
        </TouchableOpacity>
    );
};

export default ButtonStandard;