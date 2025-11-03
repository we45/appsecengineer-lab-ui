import { BaseInput } from 'src/components/wrappers/BaseInput'
import { BaseSelect } from 'src/components/wrappers/BaseSelect'
import { BaseToggle } from 'src/components/wrappers/BaseToggle'
import { BaseCard } from 'src/components/wrappers/BaseCard'
import { BaseBtn } from 'src/components/wrappers/BaseBtn'
import { BaseTable } from 'src/components/wrappers/BaseTable'
import { BaseTabs } from 'src/components/wrappers/BaseTabs'
import { BaseOptionGroup } from 'src/components/wrappers/BaseOptionGroup'
import { BaseBtnDropdown } from 'src/components/wrappers/BaseBtnDropdown.vue'
import { BaseDialog } from 'src/components/wrappers/BaseDialog'
import { BaseInnerLoading } from 'src/components/wrappers/BaseInnerLoading'
import { BaseFile } from 'src/components/wrappers/BaseFile'
export default async function ({ app }) {
  app.component(BaseInput.name, BaseInput)
  app.component(BaseSelect.name, BaseSelect)
  app.component(BaseToggle.name, BaseToggle)
  app.component(BaseCard.name, BaseCard)
  app.component(BaseBtn.name, BaseBtn)
  app.component(BaseTable.name, BaseTable)
  app.component(BaseTabs.name, BaseTabs)
  app.component(BaseOptionGroup.name, BaseOptionGroup)
  app.component(BaseBtnDropdown.name, BaseBtnDropdown)
  app.component(BaseDialog.name, BaseDialog)
  app.component(BaseInnerLoading.name, BaseInnerLoading)
  app.component(BaseFile.name, BaseFile)
}
