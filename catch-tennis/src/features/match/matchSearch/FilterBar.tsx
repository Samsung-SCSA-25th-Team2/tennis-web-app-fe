import {Button} from "../../../shared/components/atoms"

const FilterBar = () => {

    return (
        <div className="flex flex-col gap-xs">
            <div className="flex justify-between">
                <Button buttonSize={'lg'}>LG</Button>
                <Button buttonSize={'lg'}>LG</Button>
            </div>
            <div className="flex justify-between">
                <Button buttonSize={'xl'}>XL</Button>
                <Button buttonSize={'sm'}>SM</Button>

            </div>
        </div>
    )
}

export default FilterBar