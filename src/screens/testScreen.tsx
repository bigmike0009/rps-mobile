import { PieChart } from "~/components/PieChart/components/BarChart"
import { Button } from "react-native-paper"
import { useOverlay } from "~/providers/animationProvider"

export const TestScreen: React.FC = () => {

    const {triggerAnimation} = useOverlay()
    return (
        <Button
        onPress={()=>triggerAnimation('particles')}>Click</Button>
    )
}
