import asyncio
import uuid
import time
import httpx
from system_tests.e2e.base_test import BaseTestServerStream, STREAM_ENDPOINT


class LoadTest(BaseTestServerStream):
    """
    Load test for concurrent users.
    """

    # Configure environment for API mode (no browser)
    test_env_vars = {
        "CUGA_MODE": "api",
        "CUGA_TEST_ENV": "true",
        "DYNACONF_ADVANCED_FEATURES__TRACKER_ENABLED": "true",
    }

    async def run_single_user_task(self, user_id: int, thread_id: str) -> bool:
        """
        Runs a task for a single user and verifies the result.
        """
        query = "list all my accounts, how many are there?"
        expected_keywords = ["50"]

        print(f"User {user_id} (Thread {thread_id}): Starting task...")

        try:
            # We need to manually implement run_task here to pass headers
            # BaseTestServerStream.run_task doesn't support custom headers easily without modification
            # So I'll replicate the logic here with the header

            all_events = []
            async with httpx.AsyncClient(timeout=60.0) as client:
                async with client.stream(
                    "POST",
                    STREAM_ENDPOINT,
                    json={"query": query},
                    headers={"Accept": "text/event-stream", "X-Thread-ID": thread_id},
                ) as response:
                    if response.status_code != 200:
                        print(f"User {user_id}: Failed with status {response.status_code}")
                        return False

                    buffer = b""
                    async for chunk in response.aiter_bytes():
                        buffer += chunk
                        while b"\n\n" in buffer:
                            event_block, buffer = buffer.split(b"\n\n", 1)
                            event_lines = event_block.split(b"\n")
                            event_data = {}
                            for line in event_lines:
                                line = line.strip()
                                if not line:
                                    continue
                                if line.startswith(b"event: "):
                                    event_data["event"] = line[len(b"event: ") :].decode("utf-8").strip()
                                elif line.startswith(b"data: "):
                                    try:
                                        data_str = line[len(b"data: ") :].decode("utf-8").strip()
                                        event_data["data"] = self._parse_event_data(data_str)
                                    except Exception:
                                        event_data["data"] = line[len(b"data: ") :].strip()

                            if event_data:
                                all_events.append(event_data)
                                if event_data.get("event") == "Answer":
                                    break

            # Verify result
            answer_event = next((e for e in all_events if e.get("event") == "Answer"), None)
            if not answer_event:
                print(f"User {user_id}: No Answer event found")
                return False

            answer_data = str(answer_event.get("data", "")).lower()
            for keyword in expected_keywords:
                if keyword.lower() not in answer_data:
                    print(f"User {user_id}: Answer missing keyword '{keyword}'. Got: {answer_data}")
                    return False

            print(f"User {user_id}: Success!")
            return True

        except Exception as e:
            print(f"User {user_id}: Exception: {e}")
            return False

    async def test_concurrent_users(self):
        """
        Simulate 20 concurrent users running the same task.
        """
        num_users = 20
        print(f"\n--- Starting Load Test with {num_users} users ---")

        start_time = time.time()

        tasks = []
        for i in range(num_users):
            thread_id = str(uuid.uuid4())
            tasks.append(self.run_single_user_task(i, thread_id))

        results = await asyncio.gather(*tasks)

        end_time = time.time()
        duration = end_time - start_time

        success_count = sum(1 for r in results if r)
        failure_count = num_users - success_count

        print(f"\n--- Load Test Completed in {duration:.2f}s ---")
        print(f"Total Users: {num_users}")
        print(f"Success: {success_count}")
        print(f"Failure: {failure_count}")

        self.assertEqual(failure_count, 0, f"{failure_count} users failed the test")
