import type { ComponentType } from "react"

import VoiceOrbExample from "./voice-orb"
import MessageBubbleExample from "./message-bubble"
import MessageExample from "./message"
import MessageScrollerExample from "./message-scroller"
import PromptInputExample from "./prompt-input"
import StreamingResponseExample from "./streaming-response"
import CitationsExample from "./citations"
import AgentActivityExample from "./agent-activity"
import LoadingStatesExample from "./loading-states"
import TodoListExample from "./todo-list"
import ToolResultExample from "./tool-result"
import CodeBlockExample from "./code-block"
import FileDiffExample from "./file-diff"
import ApprovalCardExample from "./approval-card"
import ToolApprovalExample from "./tool-approval"
import ImageGenerationExample from "./image-generation"
import AiSidebarExample from "./ai-sidebar"
import ChatAppExample from "./chat-app"
import AccordionExample from "./accordion"
import AnimatedSidebarExample from "./animated-sidebar"
import AvatarExample from "./avatar"
import BadgeExample from "./badge"
import ButtonExample from "./button"
import CardExample from "./card"
import CheckboxExample from "./checkbox"
import CommandPaletteExample from "./command-palette"
import TableExample from "./table"
import DateRangePickerExample from "./date-range-picker"
import DialogExample from "./dialog"
import DrawerExample from "./drawer"
import DropdownMenuExample from "./dropdown-menu"
import InputExample from "./input"
import KbdExample from "./kbd"
import LabelExample from "./label"
import PopoverExample from "./popover"
import RadioGroupExample from "./radio-group"
import SelectExample from "./select"
import SeparatorExample from "./separator"
import SkeletonExample from "./skeleton"
import SwitchExample from "./switch"
import TabsExample from "./tabs"
import TextareaExample from "./textarea"
import SonnerExample from "./sonner"
import TooltipExample from "./tooltip"
import ActionSwapExample from "./action-swap"
import AnimatedNumberExample from "./animated-number"
import BlurTextExample from "./blur-text"
import CopyButtonExample from "./copy-button"
import LoaderExample from "./loader"
import MagneticExample from "./magnetic"
import MarqueeExample from "./marquee"
import PixelFieldExample from "./pixel-field"
import PreviewRailExample from "./preview-rail"
import RevealExample from "./reveal"
import ShimmerTextExample from "./shimmer-text"
import SpotlightCardExample from "./spotlight-card"
import TextScrambleExample from "./text-scramble"
import QuestionCardExample from "./question-card"
import ChatPanelExample from "./chat-panel"
import RecommendationCardExample from "./recommendation-card"
import ContextCardsExample from "./context-cards"
import SearchListExample from "./search-list"
import FilterTableExample from "./filter-table"
import FlowchartExample from "./flowchart"
import InsightCardsExample from "./insight-cards"
import PromptBarExample from "./prompt-bar"
import SelectionActionsExample from "./selection-actions"
import PixelLoaderExample from "./pixel-loader"
import ThinkingTraceExample from "./thinking-trace"
import StreamingAnswerExample from "./streaming-answer"
import TaskRowsExample from "./task-rows"
import ToolChipsExample from "./tool-chips"
import AgentScreenExample from "./agent-screen"
import CodePanelExample from "./code-panel"
import FineTuneCardExample from "./fine-tune-card"
import SidebarNavExample from "./sidebar-nav"
import RecordsTableExample from "./records-table"
import DiffTableExample from "./diff-table"
import CrmPipelineExample from "./crm-pipeline"
import AnalyticsDashboardExample from "./analytics-dashboard"
import SettingsPageExample from "./settings-page"
import AuthScreenExample from "./auth-screen"
import AgentWorkspaceExample from "./agent-workspace"
import QuantityStepperExample from "./quantity-stepper"
import ProgressExample from "./progress"
import StatExample from "./stat"
import EmptyStateExample from "./empty-state"
import StepperExample from "./stepper"
import ThemeToggleExample from "./theme-toggle"
import SiteHeaderExample from "./site-header"
import QrCodeExample from "./qr-code"
import TicketPassExample from "./ticket-pass"
import CheckoutExample from "./checkout"
import CatalogExample from "./catalog"
import DetailPageExample from "./detail-page"
import OrderConfirmationExample from "./order-confirmation"
import PageHeaderExample from "./page-header"
import FieldExample from "./field"
import DatePickerExample from "./date-picker"
import RepeaterFieldExample from "./repeater-field"
import TimelineExample from "./timeline"
import AlertExample from "./alert"
import StatusIndicatorExample from "./status-indicator"
import SliderExample from "./slider"
import DropzoneExample from "./dropzone"
import OtpInputExample from "./otp-input"
import WaveformExample from "./waveform"
import LiveWaveformExample from "./live-waveform"
import BarVisualizerExample from "./bar-visualizer"
import AudioPlayerExample from "./audio-player"
import ScrubBarExample from "./scrub-bar"
import TranscriptViewerExample from "./transcript-viewer"
import MicSelectorExample from "./mic-selector"
import VoiceButtonExample from "./voice-button"

/** Live example for each component page, keyed by slug. */
export const EXAMPLES: Record<string, ComponentType> = {
  "voice-orb": VoiceOrbExample,
  "message-bubble": MessageBubbleExample,
  message: MessageExample,
  "message-scroller": MessageScrollerExample,
  "prompt-input": PromptInputExample,
  "streaming-response": StreamingResponseExample,
  citations: CitationsExample,
  "agent-activity": AgentActivityExample,
  "loading-states": LoadingStatesExample,
  "todo-list": TodoListExample,
  "tool-result": ToolResultExample,
  "code-block": CodeBlockExample,
  "file-diff": FileDiffExample,
  "approval-card": ApprovalCardExample,
  "tool-approval": ToolApprovalExample,
  "image-generation": ImageGenerationExample,
  "ai-sidebar": AiSidebarExample,
  "chat-app": ChatAppExample,
  accordion: AccordionExample,
  "animated-sidebar": AnimatedSidebarExample,
  avatar: AvatarExample,
  badge: BadgeExample,
  button: ButtonExample,
  card: CardExample,
  checkbox: CheckboxExample,
  "command-palette": CommandPaletteExample,
  table: TableExample,
  "date-range-picker": DateRangePickerExample,
  dialog: DialogExample,
  drawer: DrawerExample,
  "dropdown-menu": DropdownMenuExample,
  input: InputExample,
  kbd: KbdExample,
  label: LabelExample,
  popover: PopoverExample,
  "radio-group": RadioGroupExample,
  select: SelectExample,
  separator: SeparatorExample,
  skeleton: SkeletonExample,
  switch: SwitchExample,
  tabs: TabsExample,
  textarea: TextareaExample,
  sonner: SonnerExample,
  tooltip: TooltipExample,
  "action-swap": ActionSwapExample,
  "animated-number": AnimatedNumberExample,
  "blur-text": BlurTextExample,
  "copy-button": CopyButtonExample,
  loader: LoaderExample,
  magnetic: MagneticExample,
  marquee: MarqueeExample,
  "pixel-field": PixelFieldExample,
  "preview-rail": PreviewRailExample,
  reveal: RevealExample,
  "shimmer-text": ShimmerTextExample,
  "spotlight-card": SpotlightCardExample,
  "text-scramble": TextScrambleExample,
  "question-card": QuestionCardExample,
  "chat-panel": ChatPanelExample,
  "recommendation-card": RecommendationCardExample,
  "context-cards": ContextCardsExample,
  "search-list": SearchListExample,
  "filter-table": FilterTableExample,
  flowchart: FlowchartExample,
  "insight-cards": InsightCardsExample,
  "prompt-bar": PromptBarExample,
  "selection-actions": SelectionActionsExample,
  "pixel-loader": PixelLoaderExample,
  "thinking-trace": ThinkingTraceExample,
  "streaming-answer": StreamingAnswerExample,
  "task-rows": TaskRowsExample,
  "tool-chips": ToolChipsExample,
  "agent-screen": AgentScreenExample,
  "code-panel": CodePanelExample,
  "fine-tune-card": FineTuneCardExample,
  "sidebar-nav": SidebarNavExample,
  "records-table": RecordsTableExample,
  "diff-table": DiffTableExample,
  "crm-pipeline": CrmPipelineExample,
  "analytics-dashboard": AnalyticsDashboardExample,
  "settings-page": SettingsPageExample,
  "auth-screen": AuthScreenExample,
  "agent-workspace": AgentWorkspaceExample,
  "quantity-stepper": QuantityStepperExample,
  progress: ProgressExample,
  stat: StatExample,
  "empty-state": EmptyStateExample,
  stepper: StepperExample,
  "theme-toggle": ThemeToggleExample,
  "site-header": SiteHeaderExample,
  "qr-code": QrCodeExample,
  "ticket-pass": TicketPassExample,
  checkout: CheckoutExample,
  catalog: CatalogExample,
  "detail-page": DetailPageExample,
  "order-confirmation": OrderConfirmationExample,
  "page-header": PageHeaderExample,
  field: FieldExample,
  "date-picker": DatePickerExample,
  "repeater-field": RepeaterFieldExample,
  timeline: TimelineExample,
  alert: AlertExample,
  "status-indicator": StatusIndicatorExample,
  slider: SliderExample,
  dropzone: DropzoneExample,
  "otp-input": OtpInputExample,
  waveform: WaveformExample,
  "live-waveform": LiveWaveformExample,
  "bar-visualizer": BarVisualizerExample,
  "audio-player": AudioPlayerExample,
  "scrub-bar": ScrubBarExample,
  "transcript-viewer": TranscriptViewerExample,
  "mic-selector": MicSelectorExample,
  "voice-button": VoiceButtonExample,
}
