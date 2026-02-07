
import sys
print(sys.executable)
try:
    import torch
    print(f"Torch version: {torch.__version__}")
    x = torch.rand(5, 3)
    print(x)
except ImportError as e:
    print(f"ImportError: {e}")
except OSError as e:
    print(f"OSError: {e}")
except Exception as e:
    print(f"Error: {e}")
